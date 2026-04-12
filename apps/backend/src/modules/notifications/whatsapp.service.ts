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
    // Strip all non-digit characters
    let digits = phone.replace(/\D/g, '');

    // If starts with 0, remove leading zero (local BR format)
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }

    // If it doesn't start with country code 55, prepend it
    if (!digits.startsWith('55')) {
      digits = `55${digits}`;
    }

    return digits;
  }

  /**
   * Send a text message via WhatsApp Cloud API
   */
  async sendTextMessage(phone: string, text: string): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        `WhatsApp not configured — skipping message to ${phone.slice(-4)}`,
      );
      return false;
    }

    const formattedPhone = this.formatPhoneE164(phone);
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    };

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
          `WhatsApp API error (${response.status}): ${JSON.stringify(errorData)}`,
        );
        return false;
      }

      const data = await response.json();
      this.logger.log(
        `WhatsApp message sent to ...${formattedPhone.slice(-4)} — ID: ${data?.messages?.[0]?.id || 'unknown'}`,
      );
      return true;
    } catch (error: any) {
      this.logger.error(
        `WhatsApp send failed: ${error.message || error}`,
      );
      return false;
    }
  }

  /**
   * Send a medication reminder via WhatsApp
   */
  async sendMedicationReminder(
    phone: string,
    medicationName: string,
    dosage: string,
    time: Date,
  ): Promise<boolean> {
    const timeStr = time.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });

    const text =
      `💊 *Hora do ${medicationName}!*\n\n` +
      `Dose: ${dosage}\n` +
      `Horário: ${timeStr}\n\n` +
      `Acesse o Pills para marcar como tomado. ✅`;

    return this.sendTextMessage(phone, text);
  }
}
