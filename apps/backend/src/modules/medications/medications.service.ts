import { Injectable } from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createMedicationDto: CreateMedicationDto) {
    return this.prisma.medication.create({
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
  }

  async findAllByUser(userId: string) {
    return this.prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
      throw new Error('Medication not found or unauthorized');
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
      throw new Error('Medication not found or unauthorized');
    }

    return this.prisma.medication.delete({
      where: { id },
    });
  }
}
