import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnalyzePrescriptionResponseDto } from './dto/analyze-prescription-response.dto';

@Injectable()
export class PrescriptionOcrService {
  private readonly logger = new Logger(PrescriptionOcrService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn('OPENAI_API_KEY not configured — prescription OCR disabled');
    }
  }

  async analyzePrescription(imageBuffer: Buffer, mimeType: string): Promise<AnalyzePrescriptionResponseDto> {
    // Lazy imports to avoid breaking the entire app if packages are not available
    const OpenAI = (await import('openai')).default;
    const { zodResponseFormat } = await import('openai/helpers/zod');
    const { z } = await import('zod');

    const PrescriptionSchema = z.object({
      medications: z.array(
        z.object({
          name: z.string().describe('Nome do medicamento conforme escrito na receita'),
          dosage: z.string().describe('Dosagem prescrita, ex: "1 comprimido", "500mg", "10ml"'),
          frequency: z
            .enum(['4h', '6h', '8h', '12h', 'daily'])
            .describe(
              'Frequência de uso interpretada: "4h" = a cada 4 horas, "6h" = a cada 6 horas, "8h" = a cada 8 horas (3x ao dia), "12h" = a cada 12 horas (2x ao dia), "daily" = 1x ao dia. Interprete a prescrição e escolha a opção mais próxima.',
            ),
          criticality: z
            .enum(['low', 'medium', 'high'])
            .describe(
              'Criticidade estimada: "high" para antibióticos, controlados, insulina; "medium" para anti-inflamatórios, anti-hipertensivos; "low" para vitaminas, analgésicos comuns.',
            ),
          notes: z
            .string()
            .nullable()
            .describe('Observações adicionais encontradas na receita, ex: "tomar em jejum", "antes de dormir"'),
        }),
      ),
      doctor_name: z.string().nullable().describe('Nome do médico, se legível na receita'),
      patient_name: z.string().nullable().describe('Nome do paciente, se legível na receita'),
    });

    const openai = new OpenAI({ apiKey: this.apiKey });
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    this.logger.log('Sending prescription image to GPT-4o-mini for analysis...');

    const completion = await openai.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente especializado em ler e interpretar receitas médicas brasileiras.
Analise a imagem da receita médica e extraia todos os medicamentos prescritos.
Para cada medicamento, identifique:
- O nome do medicamento
- A dosagem prescrita
- A frequência de uso (interprete para a opção mais próxima disponível)
- A criticidade estimada com base no tipo de medicamento
- Quaisquer observações relevantes (ex: "tomar com água", "em jejum")

Se não conseguir ler alguma informação claramente, use seu melhor julgamento baseado no contexto.
Responda sempre em português do Brasil.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta receita médica e extraia as informações de todos os medicamentos prescritos.',
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(PrescriptionSchema, 'prescription'),
      max_tokens: 2000,
    });

    const message = completion.choices[0]?.message;

    if (!message?.parsed) {
      this.logger.error('GPT-4o-mini did not return a parsed response');
      throw new Error('Não foi possível analisar a receita. Tente novamente com uma foto mais nítida.');
    }

    const parsed = message.parsed;

    this.logger.log(`Extracted ${parsed.medications.length} medication(s) from prescription`);

    return {
      medications: parsed.medications.map((med) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        criticality: med.criticality,
        notes: med.notes,
      })),
      doctorName: parsed.doctor_name,
      patientName: parsed.patient_name,
    };
  }
}
