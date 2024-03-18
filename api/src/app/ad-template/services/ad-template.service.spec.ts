import { AdTemplateService } from '@api/ad-template/services/ad-template.service';
import { ThirdPartyAdTemplateApiService } from '@instigo-app/third-party-connector';
import { Test } from '@nestjs/testing';
import { SupportedProviders } from '@instigo-app/data-transfer-object';

const options = {
  workspace: { owner: { getAccessToken: (sometihg) => 'access-token' } },
  adAccount: { provider: SupportedProviders.FACEBOOK, providerId: 'fasdfag', businessId: '524243' },
  video: { location: 'https://fasdfdas', originalname: 'test-vide.mp4' },
} as any;

describe('ad-template.service.ts', () => {
  describe('happy case', () => {
    let service: AdTemplateService;
    let thirdPartyService: ThirdPartyAdTemplateApiService;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          AdTemplateService,
          {
            provide: ThirdPartyAdTemplateApiService,
            useValue: {
              uploadVideo: () => Promise.resolve({ id: 'providerId' }),
              status: () => Promise.resolve({ status: { video_status: 'ready' }, published: true }),
            },
          },
        ],
      }).compile();

      service = moduleRef.get<AdTemplateService>(AdTemplateService);
      thirdPartyService = moduleRef.get<ThirdPartyAdTemplateApiService>(ThirdPartyAdTemplateApiService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    xit('should poll once', async () => {
      expect(await service.uploadVideo(options)).toEqual({ providerId: 'providerId' });
    });

    it('should poll twice', (done) => {
      jest.spyOn(thirdPartyService, 'status').mockReturnValue(
        Promise.resolve({
          status: { video_status: 'ready' },
          published: false,
        }),
      );

      const promise = service.uploadVideo(options);

      setTimeout(() => {
        jest.spyOn(thirdPartyService, 'status').mockReturnValue(
          Promise.resolve({
            status: { video_status: 'ready' },
            published: true,
          }),
        );

        void promise.then((result) => {
          expect(result).toEqual({ providerId: 'providerId' });
          done();
        });
      }, 1000);
    });
  });
});
