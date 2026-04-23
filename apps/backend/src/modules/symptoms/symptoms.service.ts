import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';

@Injectable()
export class SymptomsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSymptomDto: CreateSymptomDto) {
    return this.prisma.symptomLog.create({
      data: {
        ...createSymptomDto,
        userId,
      },
      include: {
        medication: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.symptomLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        medication: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    const symptom = await this.prisma.symptomLog.findFirst({
      where: { id, userId },
    });

    if (!symptom) {
      throw new NotFoundException('Sintoma não encontrado');
    }

    return this.prisma.symptomLog.delete({
      where: { id },
    });
  }
}
