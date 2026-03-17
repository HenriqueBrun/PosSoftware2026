import { Controller, Post, Body, UseGuards, Request, Get, Put, Param, Delete } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  create(@Request() req: any, @Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(req.user.userId, createMedicationDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.medicationsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.medicationsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() updateMedicationDto: UpdateMedicationDto) {
    return this.medicationsService.update(id, req.user.userId, updateMedicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.medicationsService.remove(id, req.user.userId);
  }
}
