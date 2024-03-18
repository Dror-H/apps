import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { DatabaseService } from 'apps/cron-worker/src/app/database/db.service';
import { of } from 'rxjs';
import { SegmentsService } from '../services/segments.service';
import { SeedSegmentsService } from './seed-segments.service';

describe('SeedSegmentsService Test suite', () => {
  let service: SeedSegmentsService;
  let databaseService: DatabaseService;
  let segmentsService: SegmentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SeedSegmentsService,
        { provide: HttpService, useValue: { get: () => of(), post: () => of() } },
        { provide: DatabaseService, useValue: { audiences: { many: () => {} } } },
        {
          provide: SegmentsService,
          useValue: {
            targetingBrowse: () => {},
            targetingOptions: () => {},
            saveSegmentsDetails: () => {},
            searchSegmentDetails: () => {},
            getSegmentDetails: () => {},
            getSegmentsTargetingStatus: () => {},
            getSegmentsTargetingValidation: () => {},
          },
        },
      ],
    }).compile();

    service = module.get<SeedSegmentsService>(SeedSegmentsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    segmentsService = module.get<SegmentsService>(SegmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should call getTargetingBrowseAndOptions', async () => {
      const spy = jest
        .spyOn(service as any, 'getTargetingBrowseAndOptions')
        .mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getSegments').mockImplementation(() => Promise.resolve('test'));
      jest.spyOn(service as any, 'searchForDetails').mockImplementation(() => Promise.resolve());
      await service.seed();
      expect(spy).toBeCalled();
    });

    it('should call searchForDetails with returned segments', async () => {
      jest.spyOn(service as any, 'getTargetingBrowseAndOptions').mockImplementation(() => Promise.resolve());
      jest.spyOn(service as any, 'getSegments').mockImplementation(() => Promise.resolve('test'));
      const spy = jest.spyOn(service as any, 'searchForDetails').mockImplementation(() => Promise.resolve());
      await service.seed();
      expect(spy).toBeCalledWith('test');
    });
  });

  describe('getTargetingBrowseAndOptions', () => {
    it('should call saveSegmentsDetails with return from targetingBrowse and targetingOptions', async () => {
      jest.spyOn(segmentsService, 'targetingBrowse').mockImplementation(() => Promise.resolve(['browse test'] as any));
      jest
        .spyOn(segmentsService, 'targetingOptions')
        .mockImplementation(() => Promise.resolve(['options test'] as any));
      const spy = jest.spyOn(segmentsService, 'saveSegmentsDetails').mockImplementation();
      await (service as any).getTargetingBrowseAndOptions();
      expect(spy).toBeCalledWith(['browse test', 'options test']);
    });
  });

  describe('searchForDetails', () => {
    it('should call searchForDetails with segments and filter undefined', async () => {
      const segments = [{ id: '1', name: 'test 1' }, undefined];
      const spy = jest.spyOn(segmentsService, 'saveSegmentsDetails');
      await (service as any).searchForDetails(segments);
      expect(spy).toBeCalledWith([{ id: '1', name: 'test 1' }]);
    });

    it('should log saved segments count', async () => {
      const segments = [
        { id: '1', name: 'test 1' },
        { id: '2', name: 'test 2' },
      ];
      jest.spyOn(segmentsService, 'saveSegmentsDetails').mockImplementation(() => Promise.resolve(2));
      const spy = jest.spyOn((service as any).logger, 'log');
      await (service as any).searchForDetails(segments);
      expect(spy).toBeCalledWith('Saved 2 segments');
    });

    it('should chunk calls to saved segments by 10000', async () => {
      const segments = Array.from(new Array(11000)).map((v, i) => ({ id: i, name: `test-${i}` }));
      const spy = jest.spyOn(segmentsService, 'saveSegmentsDetails');
      await (service as any).searchForDetails(segments);
      expect(spy.mock.calls[0][0].length).toBe(10000);
      expect(spy.mock.calls[1][0].length).toBe(1000);
    });
  });
});
