import { Module } from '@nestjs/common';
import { PrescriptionOcrController } from './prescription-ocr.controller';
import { PrescriptionOcrService } from './prescription-ocr.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PrescriptionOcrController],
  providers: [PrescriptionOcrService],
})
export class PrescriptionOcrModule {}
