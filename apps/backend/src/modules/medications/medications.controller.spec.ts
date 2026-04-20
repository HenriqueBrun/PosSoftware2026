import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

describe('MedicationsController', () => {
  let controller: MedicationsController;
  let service: MedicationsService;

  const mockMedicationsService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findUpcomingEventsByUser: jest.fn(),
    findEventsByUser: jest.fn(),
    updateEventStatus: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockClerkAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [
        {
          provide: MedicationsService,
          useValue: mockMedicationsService,
        },
      ],
    })
      .overrideGuard(ClerkAuthGuard)
      .useValue(mockClerkAuthGuard)
      .compile();

    controller = module.get<MedicationsController>(MedicationsController);
    service = module.get<MedicationsService>(MedicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service create', async () => {
      const dto = { name: 'Pill' };
      const req = { user: { userId: 'user-1' } };
      await controller.create(req, dto as any);
      expect(service.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should call service findAllByUser', async () => {
      const req = { user: { userId: 'user-1' } };
      await controller.findAll(req);
      expect(service.findAllByUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('updateEventStatus', () => {
    it('should call service updateEventStatus', async () => {
      const req = { user: { userId: 'user-1' } };
      await controller.updateEventStatus('event-1', req, 'TAKEN');
      expect(service.updateEventStatus).toHaveBeenCalledWith('event-1', 'user-1', 'TAKEN');
    });
  });
});
