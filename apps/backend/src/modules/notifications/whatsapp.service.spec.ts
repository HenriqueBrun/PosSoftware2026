import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { ConfigService } from '@nestjs/config';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'WHATSAPP_PHONE_NUMBER_ID') return '123456789';
      if (key === 'WHATSAPP_ACCESS_TOKEN') return 'secret-token';
      return null;
    }),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    
    // Mock global fetch
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ messaging_product: 'whatsapp', contacts: [], messages: [] }),
      })
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'WHATSAPP_PHONE_NUMBER_ID') return '123456789';
              if (key === 'WHATSAPP_ACCESS_TOKEN') return 'secret-token';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isConfigured', () => {
    it('should return true if credentials are set', () => {
      expect(service.isConfigured()).toBe(true);
    });

    it('should return false if credentials are missing', async () => {
      mockConfigService.get.mockReturnValue(null);
      // Re-instantiate to trigger constructor again or just check logic if possible
      // Since they are private/readonly, we'd need a new instance
      const module = await Test.createTestingModule({
        providers: [
          WhatsappService,
          { provide: ConfigService, useValue: { get: () => null } },
        ],
      }).compile();
      const unconfiguredService = module.get<WhatsappService>(WhatsappService);
      expect(unconfiguredService.isConfigured()).toBe(false);
    });
  });

  describe('sendMedicationReminder', () => {
    it('should call fetch with correct parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ messaging_product: 'whatsapp', contacts: [], messages: [] }),
      });

      const phone = '5511999999999';
      const name = 'Medicine';
      const dosage = '1 pill';
      const time = new Date();

      const result = await service.sendMedicationReminder(phone, name, dosage, time);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('123456789/messages'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer secret-token',
          }),
        })
      );
    });

    it('should return false if fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'bad request' }),
      });

      const result = await service.sendMedicationReminder('123', 'A', 'B', new Date());
      expect(result).toBe(false);
    });
  });
});
