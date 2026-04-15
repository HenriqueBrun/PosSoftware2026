import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly phoneNumberId: string | undefined;
  private readonly accessToken: string | undefined;
  private readonly apiVersion = 'v21.0';

  constructor(private readonly configService: ConfigService) {
    this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');
    this.accessToken = this.configService.get<string>('WHATSAPP_ACCESS_TOKEN');

    if (this.phoneNumberId && this.accessToken) {
      this.logger.log('WhatsApp Cloud API configured ✓');
    } else {
      this.logger.warn(
        'WhatsApp credentials not configured — WhatsApp notifications disabled',
      );
    }
  }

  /**
   * Check if WhatsApp sending is available
   */
  isConfigured(): boolean {
    return !!(this.phoneNumberId && this.accessToken);
  }

  /**
   * Format phone number to E.164 (remove +, spaces, dashes, parens).
   * Ensures Brazilian numbers have country code 55.
   */
  private formatPhoneE164(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.substring(1);
    if (!digits.startsWith('55')) digits = `55${digits}`;
    return digits;
  }

  /**
   * Send a plain text message via WhatsApp Cloud API.
   * NOTE: Only works within the 24-hour customer service window.
   * For proactive messages use sendTemplateMessage() instead.
   */
  async sendTextMessage(phone: string, text: string): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(`WhatsApp not configured — skipping text to ${phone.slice(-4)}`);
      return false;
    }

    const formattedPhone = this.formatPhoneE164(phone);
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

    return this.post(url, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: { preview_url: false, body: text },
    }, formattedPhone);
  }

  /**
   * Send a pre-approved Meta template message.
   * Templates work outside the 24-hour window — ideal for proactive reminders.
   *
   * @param phone        Recipient phone number
   * @param templateName Name of the approved template (e.g. 'lembrete_medicacao')
   * @param languageCode BCP-47 language code (default: 'pt_BR')
   * @param components   Template components with dynamic parameters
   */
  async sendTemplateMessage(
    phone: string,
    templateName: string,
    languageCode: string,
    components: object[],
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        `WhatsApp not configured — skipping template "${templateName}" to ${phone.slice(-4)}`,
      );
      return false;
    }

    const formattedPhone = this.formatPhoneE164(phone);
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

    return this.post(url, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    }, formattedPhone);
  }

  /**
   * Send a medication reminder using a pre-approved WhatsApp template.
   *
   * Expected template body (create in WhatsApp Manager with this text):
   *
   *   💊 *Hora do {{1}}!*
   *
   *   Dose: {{2}}
   *   Horário: {{3}}
   *
   *   Acesse o Pills para marcar como tomado. ✅
   *
   * Variables:
   *   {{1}} = nome do medicamento
   *   {{2}} = dosagem
   *   {{3}} = horário formatado (HH:mm)
   *
   * Configure via env:
   *   WHATSAPP_TEMPLATE_NAME     (default: 'lembrete_medicacao')
   *   WHATSAPP_TEMPLATE_LANGUAGE (default: 'pt_BR')
   */
  async sendMedicationReminder(
    phone: string,
    medicationName: string,
    dosage: string,
    time: Date,
  ): Promise<boolean> {
    const templateName =
      this.configService.get<string>('WHATSAPP_TEMPLATE_NAME') ?? 'lembrete_medicacao';

    const languageCode =
      this.configService.get<string>('WHATSAPP_TEMPLATE_LANGUAGE') ?? 'pt_BR';

    const timeStr = time.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });

    const components = [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: medicationName }, // {{1}}
          { type: 'text', text: dosage },          // {{2}}
          { type: 'text', text: timeStr },          // {{3}}
        ],
      },
    ];

    this.logger.log(
      `Sending template "${templateName}" to ...${phone.slice(-4)} — ${medicationName} at ${timeStr}`,
    );

    return this.sendTemplateMessage(phone, templateName, languageCode, components);
  }

  // ─── Private HTTP helper ─────────────────────────────────────────────────

  private async post(url: string, body: object, formattedPhone: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.logger.error(
          `WhatsApp API error (${response.status}) for ${formattedPhone}: ${JSON.stringify(errorData)}`,
        );
        return false;
      }

      const data = await response.json();
      this.logger.log(
        `WhatsApp message sent to ...${formattedPhone.slice(-4)} — ID: ${data?.messages?.[0]?.id ?? 'unknown'}`,
      );
      return true;
    } catch (error: any) {
      this.logger.error(`WhatsApp send failed: ${error.message || error}`);
      return false;
    }
  }
}
