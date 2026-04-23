import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { WhatsappService } from './whatsapp.service';
import * as webpush from 'web-push';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private whatsappService: WhatsappService,
  ) {
    const vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const vapidEmail = this.configService.get<string>('VAPID_EMAIL') || 'mailto:pills@example.com';

    if (vapidPublicKey && vapidPrivateKey) {
      webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
      this.logger.log('Web Push VAPID keys configured ✓');
    } else {
      this.logger.warn('VAPID keys not configured — push notifications disabled');
    }
  }

  // ─── Subscription Management ──────────────────────────────────────────

  async subscribe(userId: string, endpoint: string, p256dh: string, auth: string) {
    // Upsert: if endpoint already exists, update keys
    return this.prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh, auth, userId },
      create: { userId, endpoint, p256dh, auth },
    });
  }

  async unsubscribe(userId: string, endpoint: string) {
    return this.prisma.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });
  }

  async getSubscriptionsByUserId(userId: string) {
    return this.prisma.pushSubscription.findMany({
      where: { userId },
    });
  }

  // ─── Push Sending ─────────────────────────────────────────────────────

  async sendPushToUser(userId: string, payload: object) {
    const subscriptions = await this.getSubscriptionsByUserId(userId);
    if (subscriptions.length === 0) return;

    const payloadStr = JSON.stringify(payload);
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payloadStr,
            { TTL: 3600, urgency: 'high' },
          );
          this.logger.debug(`Push sent to ${sub.endpoint.slice(-20)}`);
        } catch (error: any) {
          // 410 Gone or 404 = subscription expired, remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            this.logger.warn(`Subscription expired, removing: ${sub.endpoint.slice(-20)}`);
            await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
          } else {
            this.logger.error(`Push failed (${error.statusCode}): ${error.message}`);
          }
          throw error;
        }
      }),
    );

    const succeeded = results.filter((r: PromiseSettledResult<void>) => r.status === 'fulfilled').length;
    const failed = results.filter((r: PromiseSettledResult<void>) => r.status === 'rejected').length;
    this.logger.log(`Push results for user ${userId}: ${succeeded} sent, ${failed} failed`);
  }

  // ─── CRON: Check Due Medication Events ────────────────────────────────

  async checkAndNotifyDueEvents() {
    const now = new Date();
    // Find pending events that are due (time <= now) and not yet notified via app
    const dueEvents = await this.prisma.medicationEvent.findMany({
      where: {
        status: 'PENDING',
        time: { lte: now },
        OR: [
          { notifiedApp: false },
          { notifiedWa: false },
        ],
      },
      include: {
        medication: {
          include: {
            user: true,
          },
        },
      },
      take: 100, // process in batches
    });

    if (dueEvents.length === 0) return;

    this.logger.log(`Found ${dueEvents.length} due medication events to notify`);

    for (const event of dueEvents) {
      const { medication } = event;
      const updateData: any = {};

      // ─── Web Push ───────────────────────────────────────────────
      if (!event.notifiedApp) {
        if (medication.notifyApp) {
          const payload = {
            title: `💊 Hora do ${medication.name}`,
            body: `Dose: ${medication.dosage} — Horário: ${new Date(event.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
            icon: '/pill-icon.png',
            badge: '/pill-badge.png',
            data: {
              url: '/dashboard',
              eventId: event.id,
              medicationId: medication.id,
            },
            tag: `med-${event.id}`,
          };

          try {
            await this.sendPushToUser(medication.userId, payload);
          } catch {
            // Error already logged in sendPushToUser
          }
        }
        updateData.notifiedApp = true;
      }

      // ─── WhatsApp ──────────────────────────────────────────────
      if (!event.notifiedWa) {
        if (medication.notifyWa && medication.user?.phone) {
          try {
            const sent = await this.whatsappService.sendMedicationReminder(
              medication.user.phone,
              medication.name,
              medication.dosage,
              new Date(event.time),
            );
            if (sent) {
              this.logger.log(`WhatsApp notification sent for event ${event.id}`);
            }
          } catch (error: any) {
            this.logger.error(`WhatsApp notification failed for event ${event.id}: ${error.message}`);
          }
        }
        updateData.notifiedWa = true;
      }

      // Mark event as notified
      await this.prisma.medicationEvent.update({
        where: { id: event.id },
        data: updateData,
      });
    }
  }

  // ─── Stock Alerts ─────────────────────────────────────────────────────

  async sendLowStockAlert(userId: string, medicationName: string, remainingStock: number) {
    this.logger.log(`Sending low stock alert to user ${userId} for ${medicationName} (${remainingStock} left)`);

    const payload = {
      title: `⚠️ Estoque Baixo: ${medicationName}`,
      body: `Você tem apenas ${remainingStock} comprimido(s) restante(s). Lembre-se de repor seu estoque em breve!`,
      icon: '/pill-icon-warning.png',
      badge: '/pill-badge.png',
      data: {
        url: '/dashboard',
      },
      tag: `stock-${medicationName}`,
    };

    try {
      await this.sendPushToUser(userId, payload);
    } catch (error: any) {
      this.logger.error(`Failed to send low stock push: ${error.message}`);
    }
  // ─── WhatsApp Testing ──────────────────────────────────────────────────

  async sendTestWhatsapp(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user?.phone) {
      this.logger.warn(`User ${userId} has no phone number for WhatsApp test`);
      throw new Error('Você precisa cadastrar um número de telefone no seu perfil primeiro.');
    }

    this.logger.log(`Sending manual WhatsApp test to ...${user.phone.slice(-4)}`);

    return this.whatsappService.sendMedicationReminder(
      user.phone,
      'Medicamento de Teste',
      '1 comprimido',
      new Date(),
    );
  }
}

