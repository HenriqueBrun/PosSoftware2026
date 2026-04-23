import { Module } from '@nestjs/common';
import { PrescriptionOcrController } from './prescription-ocr.controller';
import { PrescriptionOcrService } from './prescription-ocr.service';

@Module({
  controllers: [PrescriptionOcrController],
  providers: [PrescriptionOcrService],
})
export class PrescriptionOcrModule {}
