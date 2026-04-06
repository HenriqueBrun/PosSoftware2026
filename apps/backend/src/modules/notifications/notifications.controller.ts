import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ConfigService } from '@nestjs/config';

// ─── Authenticated Endpoints (user-facing) ─────────────────────────────

@Controller('notifications')
@UseGuards(ClerkAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * GET /notifications/vapid-key
   * Returns the VAPID public key for the frontend to use in subscription
   */
  @Get('vapid-key')
  getVapidPublicKey() {
    return {
      publicKey: this.configService.get<string>('VAPID_PUBLIC_KEY'),
    };
  }

  /**
   * POST /notifications/subscribe
   * Save a push subscription for the authenticated user
   */
  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Request() req: any,
    @Body() body: { endpoint: string; keys: { p256dh: string; auth: string } },
  ) {
    const sub = await this.notificationsService.subscribe(
      req.user.userId,
      body.endpoint,
      body.keys.p256dh,
      body.keys.auth,
    );
    return { message: 'Subscription saved', id: sub.id };
  }

  /**
   * DELETE /notifications/unsubscribe
   * Remove a push subscription
   */
  @Delete('unsubscribe')
  @HttpCode(HttpStatus.OK)
  async unsubscribe(
    @Request() req: any,
    @Body() body: { endpoint: string },
  ) {
    await this.notificationsService.unsubscribe(req.user.userId, body.endpoint);
    return { message: 'Subscription removed' };
  }

  /**
   * POST /notifications/test
   * Send a test push notification to the authenticated user
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async testNotification(@Request() req: any) {
    await this.notificationsService.sendPushToUser(req.user.userId, {
      title: '🔔 Notificação de Teste',
      body: 'As notificações do Pills estão funcionando!',
      icon: '/pill-icon.png',
      data: { url: '/dashboard' },
    });
    return { message: 'Test notification sent' };
  }
}

// ─── Cron Endpoint (Vercel Cron / external triggers) ────────────────────

@Controller('notifications')
export class NotificationsCronController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * GET /notifications/cron
   * Triggered by Vercel Cron Jobs. Not behind ClerkAuthGuard.
   * Protected by CRON_SECRET header instead.
   */
  @Get('cron')
  @HttpCode(HttpStatus.OK)
  async cronHandler(
    @Headers('authorization') authorization?: string,
  ) {
    // Verify CRON_SECRET to prevent unauthorized calls
    const cronSecret = this.configService.get<string>('CRON_SECRET');
    if (cronSecret) {
      const provided = authorization?.replace('Bearer ', '');
      if (provided !== cronSecret) {
        throw new ForbiddenException('Invalid CRON_SECRET');
      }
    }

    await this.notificationsService.checkAndNotifyDueEvents();
    return { message: 'CRON executed', timestamp: new Date().toISOString() };
  }
}

