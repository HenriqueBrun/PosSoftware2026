import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsappWebhookPayload } from './dto/whatsapp-webhook.dto';
import { WhatsappWebhookService } from './whatsapp-webhook.service';

/**
 * WhatsApp Cloud API Webhook Controller
 *
 * Docs: https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview/
 *
 * Two endpoints:
 *  - GET  /webhooks/whatsapp  → verification challenge (Facebook handshake)
 *  - POST /webhooks/whatsapp  → incoming messages & status updates
 *
 * Required env vars:
 *  - WHATSAPP_VERIFY_TOKEN   : arbitrary secret you set in the Facebook App Dashboard
 *  - WHATSAPP_APP_SECRET     : (optional) used to validate X-Hub-Signature-256 header
 */
@Controller('webhooks/whatsapp')
export class WhatsappWebhookController {
  private readonly logger = new Logger(WhatsappWebhookController.name);
  private readonly verifyToken: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappWebhookService: WhatsappWebhookService,
  ) {
    this.verifyToken =
      this.configService.get<string>('WHATSAPP_VERIFY_TOKEN') ?? '';

    if (!this.verifyToken) {
      this.logger.warn(
        'WHATSAPP_VERIFY_TOKEN not set — webhook verification will fail',
      );
    }
  }

  // ─── GET /webhooks/whatsapp ──────────────────────────────────────────────
  /**
   * Facebook calls this endpoint when you click "Verify and Save" in the
   * App Dashboard > WhatsApp > Configuration.
   *
   * It sends three query params:
   *   hub.mode          = "subscribe"
   *   hub.verify_token  = <your WHATSAPP_VERIFY_TOKEN>
   *   hub.challenge     = <random string Facebook expects you to echo back>
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    this.logger.log(
      `Webhook verification — mode: ${mode}, token_match: ${token === this.verifyToken}`,
    );

    if (mode !== 'subscribe') {
      throw new BadRequestException(`Unexpected hub.mode: ${mode}`);
    }

    if (token !== this.verifyToken) {
      this.logger.warn('Webhook verification failed: token mismatch');
      throw new ForbiddenException('Invalid verify token');
    }

    this.logger.log('WhatsApp webhook verified ✓');
    return challenge; // Must echo the challenge as plain text
  }

  // ─── POST /webhooks/whatsapp ─────────────────────────────────────────────
  /**
   * Facebook sends all events (incoming messages, status updates, etc.) here.
   * Must respond with HTTP 200 within 15 seconds — heavy processing should
   * be deferred to a background queue.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  receiveWebhook(
    @Body() payload: WhatsappWebhookPayload,
    @Headers('x-hub-signature-256') signature?: string,
  ): { status: string } {
    this.logger.debug(
      `Incoming webhook — object: ${payload?.object}, entries: ${payload?.entry?.length ?? 0}`,
    );

    // Optional: validate HMAC signature for extra security
    // (requires raw body buffer — see note in whatsapp-webhook.service.ts)
    if (signature) {
      this.logger.debug(`X-Hub-Signature-256 present: ${signature.slice(0, 20)}...`);
    }

    if (!payload || payload.object !== 'whatsapp_business_account') {
      this.logger.warn('Received non-WhatsApp webhook payload — ignoring');
      return { status: 'ignored' };
    }

    // Process synchronously (fast path) — for heavy tasks use a queue
    this.whatsappWebhookService.processPayload(payload);

    // Always respond 200 OK rapidly to prevent Facebook from retrying
    return { status: 'ok' };
  }
}
