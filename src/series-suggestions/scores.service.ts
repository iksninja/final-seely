import { Injectable, NotFoundException } from '@nestjs/common';
import { Score } from '../series-suggestions/entities/score.entity';
import { DataSource, EntityManager } from 'typeorm';
import { ScoreDto } from './dto/score.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { SeriesSuggestion } from './entities/series-suggestion.entity';
import { User } from '@app/users/entities/user.entity';

@Injectable()
export class ScoresService {

  constructor(private datasource: DataSource) { }

  async score(
    seriesSuggestionId: number,
    scoreDto: ScoreDto,
    loggedInDto: LoggedInDto,
    entityManager?: EntityManager
  ) {
      const runner = entityManager ?? this.datasource.manager;
      const scoreRepository = runner.getRepository(Score);
      const seriesSuggestionRepository = runner.getRepository(SeriesSuggestion);
      
      const user = await runner.getRepository(User).findOneByOrFail({
        username: loggedInDto.username,
      });

      const seriesSuggestion = await runner.getRepository(SeriesSuggestion).findOneByOrFail({
        id: seriesSuggestionId,
      });


      const keys = {
          seriesSuggestion ,
          user,
        }

      await scoreRepository.upsert(
          { score: scoreDto.score, ...keys },
          { conflictPaths: ['seriesSuggestion', 'user'] },
        ).catch(() => {
          throw new NotFoundException(`Not found: id=${seriesSuggestionId}`)
        })

        const { avg, count } = await scoreRepository
          .createQueryBuilder('scores')
          .select('AVG(scores.score)', 'avg')
          .addSelect('COUNT(scores.id)', 'count')
          .where('scores.series_suggestion_id = :seriesSuggestionId', { seriesSuggestionId })
          .getRawOne();

        const { suggester } = await seriesSuggestionRepository
          .createQueryBuilder('series_suggestions')
          .leftJoinAndSelect('series_suggestions.user', 'user')
          .addSelect('user.username', 'suggester')
          .where('series_suggestions.id = :seriesSuggestionId', { seriesSuggestionId })
          .getRawOne();

        const { suggesterscore } = await scoreRepository
          .createQueryBuilder('scores')
          .leftJoin('scores.user', 'user')
          .select('scores.score', 'suggesterscore')
          .where('scores.series_suggestion_id = :seriesSuggestionId', { seriesSuggestionId })
          .andWhere('user.username = :username', { username: suggester })
          .getRawOne()

        await seriesSuggestionRepository.update(seriesSuggestionId, {
          avgScore: parseFloat(avg),
          scoreCount: parseInt(count, 10),
          score: parseInt(suggesterscore),
        })

      return seriesSuggestionRepository.findOneBy({ id: seriesSuggestionId })
    }
}
