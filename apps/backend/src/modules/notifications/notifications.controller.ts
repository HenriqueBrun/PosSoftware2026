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
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('notifications')
@UseGuards(ClerkAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

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
