import { Controller, Post, Body, UseGuards, Request, Get, Put, Patch, Param, Delete, Query } from '@nestjs/common';
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

  @Get('events/upcoming')
  findUpcomingEvents(@Request() req: any) {
    return this.medicationsService.findUpcomingEventsByUser(req.user.userId, 5);
  }

  @Get('events')
  findEvents(@Request() req: any, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const sDate = startDate ? new Date(startDate) : undefined;
    const eDate = endDate ? new Date(endDate) : undefined;
    return this.medicationsService.findEventsByUser(req.user.userId, sDate, eDate);
  }

  @Patch('events/:id/status')
  updateEventStatus(@Param('id') id: string, @Request() req: any, @Body('status') status: string) {
    return this.medicationsService.updateEventStatus(id, req.user.userId, status);
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
