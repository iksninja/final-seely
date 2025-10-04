import { Module } from '@nestjs/common';
import { SeriesSuggestionsService } from './series-suggestions.service';
import { SeriesSuggestionsController } from './series-suggestions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesSuggestion } from './entities/series-suggestion.entity';
import { Score } from './entities/score.entity';
import { ScoresService } from './scores.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeriesSuggestion, Score])],
  controllers: [SeriesSuggestionsController],
  providers: [SeriesSuggestionsService, ScoresService],
})
export class SeriesSuggestionsModule {}
