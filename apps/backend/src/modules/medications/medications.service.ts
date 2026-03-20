import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private prisma: PrismaService) { }

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
        userId,
      },
    });

    await this.generateSchedule({ ...medication, startTime: createMedicationDto.startTime });
    return medication;
  }

  private async generateSchedule(medication: any) {
    // Generate dates based on frequency
    // E.g. "4h", "6h", "8h", "12h", "daily"
    const startDate = new Date(medication.startDate);
    if (medication.startTime) {
      const [hours, minutes] = medication.startTime.split(':').map(Number);
      startDate.setHours(hours, minutes, 0, 0);
    } else if (startDate.getUTCHours() === 0) {
      startDate.setUTCHours(8); // Default start time 08:00
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

    // Default to 30 days if there's no end date, or maximum 1 year
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
    let currentTime = new Date(startDate);
    while (currentTime <= endDate) {
      events.push({
        medicationId: medication.id,
        time: new Date(currentTime),
        status: 'PENDING',
      });
      currentTime.setHours(currentTime.getHours() + intervalHours);
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

    return this.prisma.medicationEvent.update({
      where: { id: eventId },
      data: { status },
    });
  }
}
