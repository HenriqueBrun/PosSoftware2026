import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MedicationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) { }

  async create(userId: string, createMedicationDto: CreateMedicationDto) {
    const medication = await this.prisma.medication.create({
      data: {
        name: createMedicationDto.name,
        dosage: createMedicationDto.dosage,
        frequency: createMedicationDto.frequency,
        startDate: new Date(createMedicationDto.startDate),
        endDate: createMedicationDto.endDate ? new Date(createMedicationDto.endDate) : null,
        criticality: createMedicationDto.criticality,
        notifyApp: createMedicationDto.notifyApp || false,
        notifySms: createMedicationDto.notifySms || false,
        notifyWa: createMedicationDto.notifyWa || false,
        notifyEmail: createMedicationDto.notifyEmail || false,
        stock: createMedicationDto.stock,
        lowStockAlert: createMedicationDto.lowStockAlert,
        userId,
      },
    });

    await this.generateSchedule({ ...medication, startTime: createMedicationDto.startTime });
    return medication;
  }

  private async generateSchedule(medication: any) {
    // Generate dates based on frequency
    // E.g. "4h", "6h", "8h", "12h", "daily"
    //
    // The frontend sends startDate as a full ISO string with the correct
    // UTC offset already applied (e.g. "2026-04-05T12:00:00.000Z" for
    // 09:00 BRT). We use it directly. Only apply a default time if the
    // date happens to be midnight UTC (legacy/fallback).
    const startDate = new Date(medication.startDate);
    if (startDate.getUTCHours() === 0 && startDate.getUTCMinutes() === 0) {
      // No time info — apply default 08:00 UTC
      startDate.setUTCHours(8, 0, 0, 0);
    }

    const intervalsInHours: Record<string, number> = {
      '4h': 4,
      '6h': 6,
      '8h': 8,
      '12h': 12,
      'daily': 24,
    };

    const intervalHours = intervalsInHours[medication.frequency];
    if (!intervalHours) return;

    // Default to 90 days if there's no end date
    let endDate = medication.endDate ? new Date(medication.endDate) : null;
    if (endDate && endDate.getUTCHours() === 0) {
      endDate.setUTCHours(23, 59, 59);
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90); // 90 days limit to avoid huge datasets
    if (!endDate || endDate > maxDate) {
      endDate = maxDate;
    }

    const events = [];
    const currentTime = new Date(startDate);
    while (currentTime <= endDate) {
      events.push({
        medicationId: medication.id,
        time: new Date(currentTime),
        status: 'PENDING',
      });
      currentTime.setUTCHours(currentTime.getUTCHours() + intervalHours);
    }

    if (events.length > 0) {
      await this.prisma.medicationEvent.createMany({
        data: events,
      });
    }
  }

  async findAllByUser(userId: string) {
    return this.prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findEventsByUser(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      medication: {
        userId,
      },
    };
    if (startDate || endDate) {
      where.time = {};
      if (startDate) where.time.gte = startDate;
      if (endDate) where.time.lte = endDate;
    }

    return this.prisma.medicationEvent.findMany({
      where,
      include: {
        medication: true,
      },
      orderBy: { time: 'asc' },
    });
  }

  async findUpcomingEventsByUser(userId: string, limit: number = 5) {
    const now = new Date();
    return this.prisma.medicationEvent.findMany({
      where: {
        medication: {
          userId,
        },
        time: {
          gte: now,
        },
        status: 'PENDING',
      },
      include: {
        medication: true,
      },
      orderBy: { time: 'asc' },
      take: limit,
    });
  }


  async findOne(id: string, userId: string) {
    return this.prisma.medication.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, updateData: any) {
    // Basic verification
    const existing = await this.prisma.medication.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Medication not found or unauthorized');
    }

    const data: any = { ...updateData };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) {
      data.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    return this.prisma.medication.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.medication.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException('Medication not found or unauthorized');
    }

    return this.prisma.medication.delete({
      where: { id },
    });
  }

  async updateEventStatus(eventId: string, userId: string, status: string) {
    const existing = await this.prisma.medicationEvent.findFirst({
      where: {
        id: eventId,
        medication: {
          userId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Medication event not found or unauthorized');
    }

    const updatedEvent = await this.prisma.medicationEvent.update({
      where: { id: eventId },
      data: { status },
      include: {
        medication: true,
      },
    });

    // ─── Stock Logic ──────────────────────────────────────────────────────
    if (status === 'TAKEN' && updatedEvent.medication.stock !== null) {
      const newStock = Math.max(0, updatedEvent.medication.stock - 1);
      
      const updatedMedication = await this.prisma.medication.update({
        where: { id: updatedEvent.medicationId },
        data: { stock: newStock },
      });

      // Check for low stock alert
      if (
        updatedMedication.lowStockAlert !== null &&
        newStock <= updatedMedication.lowStockAlert
      ) {
        await this.notificationsService.sendLowStockAlert(
          userId,
          updatedMedication.name,
          newStock,
        );
      }
    }

    return updatedEvent;
  }
}
