import { Test, TestingModule } from '@nestjs/testing';
import { SeriesSuggestionsController } from './series-suggestions.controller';
import { SeriesSuggestionsService } from './series-suggestions.service';

describe('SeriesSuggestionsController', () => {
  let controller: SeriesSuggestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesSuggestionsController],
      providers: [SeriesSuggestionsService],
    }).compile();

    controller = module.get<SeriesSuggestionsController>(SeriesSuggestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
