import { Test } from '@nestjs/testing';
import { DatabaseService } from 'apps/cron-worker/src/app/database/db.service';
import { AddToTargetingsSegmentsRelatedWordsService } from './add_to_targetings_segements_related_words.service';

describe('AddToTargetingsSegmentsRelatedWordsService Test suite', () => {
  let service: AddToTargetingsSegmentsRelatedWordsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AddToTargetingsSegmentsRelatedWordsService,
        {
          provide: DatabaseService,
          useValue: { audiences: { query: () => {} } },
        },
      ],
    }).compile();

    service = module.get<AddToTargetingsSegmentsRelatedWordsService>(AddToTargetingsSegmentsRelatedWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
