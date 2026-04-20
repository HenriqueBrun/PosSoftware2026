import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsService } from './medications.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

describe('MedicationsService', () => {
  let service: MedicationsService;
  let prisma: PrismaService;

  const mockPrisma = {
    medication: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    medicationEvent: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockNotifications = {
    sendLowStockAlert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: NotificationsService,
          useValue: mockNotifications,
        },
      ],
    }).compile();

    service = module.get<MedicationsService>(MedicationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a medication and its schedule', async () => {
      const userId = 'user-1';
      const dto = {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: '8h',
        startDate: '2026-04-05T12:00:00.000Z',
        criticality: 'MEDIUM' as any,
      };
      const medication = { id: 'med-1', ...dto, startDate: new Date(dto.startDate), userId };
      
      mockPrisma.medication.create.mockResolvedValue(medication);
      mockPrisma.medicationEvent.createMany.mockResolvedValue({ count: 10 });

      const result = await service.create(userId, dto as any);
      
      expect(result).toEqual(medication);
      expect(mockPrisma.medication.create).toHaveBeenCalled();
      expect(mockPrisma.medicationEvent.createMany).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all medications for a user', async () => {
      const userId = 'user-1';
      const medications = [{ id: '1', name: 'Med 1' }];
      mockPrisma.medication.findMany.mockResolvedValue(medications);

      const result = await service.findAllByUser(userId);
      expect(result).toEqual(medications);
      expect(mockPrisma.medication.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateEventStatus', () => {
    it('should update event status if authorized', async () => {
      const eventId = 'event-1';
      const userId = 'user-1';
      const status = 'TAKEN';
      const medication = { id: 'med-1', name: 'Med 1', stock: null };
      const event = { id: eventId, medicationId: 'med-1', medication, userId };

      mockPrisma.medicationEvent.findFirst.mockResolvedValue(event);
      mockPrisma.medicationEvent.update.mockResolvedValue({ ...event, status });

      const result = await service.updateEventStatus(eventId, userId, status);
      expect(result.status).toBe(status);
    });

    it('should decrement stock and notify if TAKEN', async () => {
      const eventId = 'event-1';
      const userId = 'user-1';
      const status = 'TAKEN';
      const initialStock = 5;
      const lowStockAlert = 5;
      
      const medication = { id: 'med-1', name: 'Med 1', stock: initialStock, lowStockAlert, userId };
      const event = { id: eventId, medicationId: 'med-1', medication };

      mockPrisma.medicationEvent.findFirst.mockResolvedValue(event);
      mockPrisma.medicationEvent.update.mockResolvedValue({ 
        ...event, 
        status, 
        medication: { ...medication } 
      });
      mockPrisma.medication.update.mockResolvedValue({ 
        ...medication, 
        stock: initialStock - 1 
      });

      await service.updateEventStatus(eventId, userId, status);

      expect(mockPrisma.medication.update).toHaveBeenCalledWith({
        where: { id: 'med-1' },
        data: { stock: initialStock - 1 }
      });
      expect(mockNotifications.sendLowStockAlert).toHaveBeenCalledWith(
        userId,
        'Med 1',
        initialStock - 1
      );
    });

    it('should throw NotFoundException if event not found', async () => {
      mockPrisma.medicationEvent.findFirst.mockResolvedValue(null);
      await expect(service.updateEventStatus('1', '1', 'TAKEN')).rejects.toThrow(NotFoundException);
    });
  });
});
