import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SymptomsService } from './symptoms.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('symptoms')
@UseGuards(ClerkAuthGuard)
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Post()
  create(@Request() req: any, @Body() createSymptomDto: CreateSymptomDto) {
    return this.symptomsService.create(req.user.userId, createSymptomDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.symptomsService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.symptomsService.remove(req.user.userId, id);
  }
}
