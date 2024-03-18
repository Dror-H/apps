import { Test } from '@nestjs/testing';
import { ValidationController } from '@api/validation/controllers/validation.controller';
import { ValidationService } from '@api/validation/service/validation.service';

describe('ValidationController', () => {
  let validationController: ValidationController;
  let validationService: ValidationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ValidationController],
      providers: [
        {
          provide: ValidationService,
          useValue: {
            pingUrl: (url: string) => Promise.resolve(true),
          },
        },
      ],
    }).compile();

    validationController = moduleRef.get<ValidationController>(ValidationController);
    validationService = moduleRef.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(validationController).toBeDefined();
  });

  it('should return true', async () => {
    expect(await validationController.isUrlValid({ url: 'http:facebook.com' })).toBeTruthy();
  });

  it('should return false', async () => {
    jest.spyOn(validationService, 'pingUrl').mockReturnValue(Promise.resolve(false));
    expect(await validationController.isUrlValid({ url: 'http:facebook.com' })).toBeFalsy();
  });
});
