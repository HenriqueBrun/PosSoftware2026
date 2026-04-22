import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { PrescriptionOcrService } from './prescription-ocr.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Controller('prescription-ocr')
@UseGuards(ClerkAuthGuard)
export class PrescriptionOcrController {
  constructor(private readonly prescriptionOcrService: PrescriptionOcrService) {}

  @Post('analyze')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Tipo de arquivo não suportado: ${file.mimetype}. Use JPEG, PNG ou WebP.`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async analyze(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhuma imagem enviada. Envie uma foto da receita médica.');
    }

    return this.prescriptionOcrService.analyzePrescription(file.buffer, file.mimetype);
  }
}
