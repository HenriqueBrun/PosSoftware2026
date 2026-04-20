import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappWebhookController } from './whatsapp-webhook.controller';
import { WhatsappWebhookService } from './whatsapp-webhook.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('WhatsappWebhookController', () => {
  let controller: WhatsappWebhookController;
  let service: WhatsappWebhookService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'WHATSAPP_VERIFY_TOKEN') return 'valid-token';
      return null;
    }),
  };

  const mockWhatsappWebhookService = {
    processPayload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsappWebhookController],
      providers: [
        { provide: ConfigService, useValue: mockConfigService },
        { provide: WhatsappWebhookService, useValue: mockWhatsappWebhookService },
      ],
    }).compile();

    controller = module.get<WhatsappWebhookController>(WhatsappWebhookController);
    service = module.get<WhatsappWebhookService>(WhatsappWebhookService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verifyWebhook', () => {
    it('should return challenge if token is valid', () => {
      const result = controller.verifyWebhook('subscribe', 'valid-token', '12345');
      expect(result).toBe('12345');
    });

    it('should throw ForbiddenException if token is invalid', () => {
      expect(() => 
        controller.verifyWebhook('subscribe', 'invalid-token', '12345')
      ).toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if mode is not subscribe', () => {
      expect(() => 
        controller.verifyWebhook('other', 'valid-token', '12345')
      ).toThrow(BadRequestException);
    });
  });

  describe('receiveWebhook', () => {
    it('should process valid payload', () => {
      const payload: any = { object: 'whatsapp_business_account', entry: [] };
      const result = controller.receiveWebhook(payload);
      expect(result).toEqual({ status: 'ok' });
      expect(service.processPayload).toHaveBeenCalledWith(payload);
    });

    it('should ignore invalid payload', () => {
      const payload: any = { object: 'other' };
      const result = controller.receiveWebhook(payload);
      expect(result).toEqual({ status: 'ignored' });
      expect(service.processPayload).not.toHaveBeenCalled();
    });
  });
});
