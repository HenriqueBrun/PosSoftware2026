import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappWebhookService } from './whatsapp-webhook.service';

describe('WhatsappWebhookService', () => {
  let service: WhatsappWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsappWebhookService],
    }).compile();

    service = module.get<WhatsappWebhookService>(WhatsappWebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPayload', () => {
    it('should process text messages', () => {
      const payload: any = {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              metadata: { phone_number_id: '123' },
              contacts: [{ wa_id: '55119', profile: { name: 'User' } }],
              messages: [{
                from: '55119',
                id: 'msg-1',
                timestamp: '123456789',
                type: 'text',
                text: { body: 'Hello' },
              }],
            },
          }],
        }],
      };

      const spy = jest.spyOn(service as any, 'onTextMessage');
      service.processPayload(payload);
      expect(spy).toHaveBeenCalledWith('55119', 'Hello', 'msg-1');
    });

    it('should process message statuses', () => {
      const payload: any = {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              statuses: [{
                id: 'msg-1',
                recipient_id: '55119',
                status: 'delivered',
                timestamp: '123456789',
              }],
            },
          }],
        }],
      };

      const spy = jest.spyOn(service as any, 'handleStatusUpdate');
      service.processPayload(payload);
      expect(spy).toHaveBeenCalled();
    });
  });
});
