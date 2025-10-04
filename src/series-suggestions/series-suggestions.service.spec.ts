import { Test, TestingModule } from '@nestjs/testing';
import { SeriesSuggestionsService } from './series-suggestions.service';

describe('SeriesSuggestionsService', () => {
  let service: SeriesSuggestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeriesSuggestionsService],
    }).compile();

    service = module.get<SeriesSuggestionsService>(SeriesSuggestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
