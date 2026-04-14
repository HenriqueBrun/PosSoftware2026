import { Injectable, Logger } from '@nestjs/common';
import {
  WhatsappWebhookPayload,
  WhatsappWebhookMessage,
  WhatsappWebhookStatus,
} from './dto/whatsapp-webhook.dto';

@Injectable()
export class WhatsappWebhookService {
  private readonly logger = new Logger(WhatsappWebhookService.name);

  /**
   * Entry point for incoming webhook payloads from WhatsApp Cloud API.
   * Iterates all entries and their changes, dispatching to the appropriate handler.
   */
  processPayload(payload: WhatsappWebhookPayload): void {
    if (payload.object !== 'whatsapp_business_account') {
      this.logger.warn(
        `Unexpected webhook object type: ${payload.object}`,
      );
      return;
    }

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') {
          this.logger.debug(`Skipping webhook field: ${change.field}`);
          continue;
        }

        const { value } = change;
        const phoneNumberId = value.metadata?.phone_number_id;

        // ── Incoming messages ──────────────────────────────────
        if (value.messages?.length) {
          for (const message of value.messages) {
            const senderName =
              value.contacts?.find((c) => c.wa_id === message.from)?.profile
                ?.name ?? 'Unknown';
            this.handleIncomingMessage(message, phoneNumberId, senderName);
          }
        }

        // ── Delivery / read status updates ────────────────────
        if (value.statuses?.length) {
          for (const status of value.statuses) {
            this.handleStatusUpdate(status);
          }
        }

        // ── Webhook-level errors ──────────────────────────────
        if (value.errors?.length) {
          for (const err of value.errors) {
            this.logger.error(
              `WhatsApp error [${err.code}] ${err.title}: ${err.message ?? ''} — ${err.error_data?.details ?? ''}`,
            );
          }
        }
      }
    }
  }

  // ─── Private Handlers ────────────────────────────────────────────────────

  private handleIncomingMessage(
    message: WhatsappWebhookMessage,
    phoneNumberId: string,
    senderName: string,
  ): void {
    const prefix = `[${phoneNumberId}] From ${senderName} (${message.from})`;

    switch (message.type) {
      case 'text':
        this.logger.log(
          `${prefix} — text: "${message.text?.body}"`,
        );
        this.onTextMessage(message.from, message.text?.body ?? '', message.id);
        break;

      case 'button':
        this.logger.log(
          `${prefix} — button reply: "${message.button?.text}" (payload: ${message.button?.payload})`,
        );
        this.onButtonReply(
          message.from,
          message.button?.payload ?? '',
          message.button?.text ?? '',
          message.id,
        );
        break;

      case 'interactive':
        if (message.interactive?.type === 'button_reply') {
          const reply = message.interactive.button_reply!;
          this.logger.log(
            `${prefix} — interactive button: "${reply.title}" (id: ${reply.id})`,
          );
          this.onInteractiveButtonReply(message.from, reply.id, reply.title, message.id);
        } else if (message.interactive?.type === 'list_reply') {
          const reply = message.interactive.list_reply!;
          this.logger.log(
            `${prefix} — interactive list: "${reply.title}" (id: ${reply.id})`,
          );
          this.onInteractiveListReply(message.from, reply.id, reply.title, message.id);
        }
        break;

      case 'reaction':
        this.logger.log(
          `${prefix} — reaction: ${message.reaction?.emoji} to message ${message.reaction?.message_id}`,
        );
        break;

      default:
        this.logger.debug(
          `${prefix} — unhandled message type: ${message.type}`,
        );
    }
  }

  private handleStatusUpdate(status: WhatsappWebhookStatus): void {
    const { id, recipient_id, status: state, timestamp } = status;
    const ts = new Date(Number(timestamp) * 1000).toISOString();

    if (state === 'failed' && status.errors?.length) {
      for (const err of status.errors) {
        this.logger.error(
          `Message ${id} to ${recipient_id} FAILED at ${ts} — [${err.code}] ${err.title}: ${err.error_data?.details ?? ''}`,
        );
      }
      return;
    }

    this.logger.log(
      `Message ${id} to ${recipient_id} — status: ${state.toUpperCase()} at ${ts}`,
    );
  }

  // ─── Extensible Business Handlers ────────────────────────────────────────
  // Override or emit events from these methods to integrate with your domain.

  /**
   * Called when a plain text message arrives.
   * @param from   Sender phone (E.164, no +)
   * @param text   Message body
   * @param msgId  WhatsApp message ID
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onTextMessage(from: string, text: string, msgId: string): void {
    // TODO: integrate with your domain logic, e.g. update medication adherence
    // Example: check if user replied "tomei" or "pulei" and update event status
  }

  /**
   * Called when a template quick-reply button is tapped.
   */
  protected onButtonReply(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    msgId: string,
  ): void {
    // TODO: handle quick-reply payloads from medication reminder templates
  }

  /**
   * Called when an interactive reply-button message is answered.
   */
  protected onInteractiveButtonReply(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    title: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    msgId: string,
  ): void {}

  /**
   * Called when a list-reply is selected.
   */
  protected onInteractiveListReply(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    title: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    msgId: string,
  ): void {}
}
