// ─── WhatsApp Webhook Payload DTOs ─────────────────────────────────────────
// Based on: https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/

export interface WhatsappWebhookText {
  body: string;
  preview_url?: boolean;
}

export interface WhatsappWebhookButton {
  payload: string;
  text: string;
}

export interface WhatsappWebhookInteractiveReply {
  id: string;
  title: string;
  description?: string;
}

export interface WhatsappWebhookInteractiveListReply {
  id: string;
  title: string;
  description?: string;
}

export interface WhatsappWebhookInteractive {
  type: 'button_reply' | 'list_reply' | 'nfm_reply';
  button_reply?: WhatsappWebhookInteractiveReply;
  list_reply?: WhatsappWebhookInteractiveListReply;
}

export interface WhatsappWebhookReaction {
  message_id: string;
  emoji: string;
}

export interface WhatsappWebhookMessage {
  id: string;
  from: string;
  timestamp: string;
  type:
    | 'text'
    | 'image'
    | 'audio'
    | 'video'
    | 'document'
    | 'sticker'
    | 'location'
    | 'button'
    | 'interactive'
    | 'reaction'
    | 'contacts'
    | 'order'
    | 'unsupported';
  text?: WhatsappWebhookText;
  button?: WhatsappWebhookButton;
  interactive?: WhatsappWebhookInteractive;
  reaction?: WhatsappWebhookReaction;
  context?: {
    from: string;
    id: string;
  };
}

export interface WhatsappWebhookContact {
  profile: { name: string };
  wa_id: string;
}

export interface WhatsappWebhookStatus {
  id: string;
  recipient_id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  errors?: Array<{
    code: number;
    title: string;
    message?: string;
    error_data?: { details: string };
  }>;
  conversation?: {
    id: string;
    expiration_timestamp?: string;
    origin: { type: string };
  };
  pricing?: {
    billable: boolean;
    pricing_model: string;
    category: string;
  };
}

export interface WhatsappWebhookValue {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: WhatsappWebhookContact[];
  messages?: WhatsappWebhookMessage[];
  statuses?: WhatsappWebhookStatus[];
  errors?: Array<{
    code: number;
    title: string;
    message?: string;
    error_data?: { details: string };
  }>;
}

export interface WhatsappWebhookChange {
  value: WhatsappWebhookValue;
  field: string;
}

export interface WhatsappWebhookEntry {
  id: string;
  changes: WhatsappWebhookChange[];
}

export interface WhatsappWebhookPayload {
  object: 'whatsapp_business_account';
  entry: WhatsappWebhookEntry[];
}
