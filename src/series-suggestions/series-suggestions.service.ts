import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeriesSuggestionDto } from './dto/create-series-suggestion.dto';
import { UpdateSeriesSuggestionDto } from './dto/update-series-suggestion.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeriesSuggestion } from './entities/series-suggestion.entity';
import { DataSource, Repository } from 'typeorm';
import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import { ScoresService } from './scores.service';
import { Score } from './entities/score.entity';
import { ScoreDto } from './dto/score.dto';
import { User } from '@app/users/entities/user.entity';

export const paginateConfig: PaginateConfig<SeriesSuggestion> = {
  sortableColumns:['id', 'name', 'avgScore', 'scoreCount'],
  searchableColumns: ['name', 'year', 'description', 'rating']
}

@Injectable()
export class SeriesSuggestionsService {

  constructor(
    @InjectRepository(SeriesSuggestion) 
    private repository: Repository<SeriesSuggestion>,
    private readonly dataSource: DataSource,
    private readonly scoresService: ScoresService
  ) {}

  private queryTemplate() {
    return this.repository
    .createQueryBuilder('series_suggestions')
    .leftJoinAndSelect('series_suggestions.rating', 'rating')
    .leftJoin('series_suggestions.user', 'user')
    .addSelect('user.id')
    .addSelect('user.username')
    .addSelect('user.role')
  }


  async create(createSeriesSuggestionDto: CreateSeriesSuggestionDto, loggedInDto: LoggedInDto) {
    return this.dataSource.transaction(async (entityManager) => {
        const seriesSuggestionRepository = entityManager.getRepository(SeriesSuggestion);
        const user = await entityManager.getRepository(User).findOneByOrFail({
        username: loggedInDto.username,
        });

        const suggestion = await seriesSuggestionRepository.save({
        ...createSeriesSuggestionDto,
        user,
      });

      await this.scoresService.score(
        suggestion.id,
        { score: createSeriesSuggestionDto.score},
        loggedInDto,
        entityManager
      );

      return seriesSuggestionRepository.findOneBy({ id: suggestion.id });
    });

  }

  async search(query: PaginateQuery) {
    const page = await paginate<SeriesSuggestion>(
      query,
      this.queryTemplate(),
      paginateConfig,
    )
    return {
      data: page.data,
      meta: page.meta
    };
  }

  findOne(id: number) {
    return this.queryTemplate().where('series_suggestions.id = :id', { id }).getOne();
  }

  async update(id: number, updateSeriesSuggestionDto: UpdateSeriesSuggestionDto, loggedInDto: LoggedInDto) {
    return this.repository
    .findOneByOrFail({ id, user:{ username: loggedInDto.username } })
    .then(() => this.repository.save({ id, ...updateSeriesSuggestionDto }))
    .catch(() => { throw new NotFoundException(`Not found: id=${id}`) });
  }

  async remove(id: number, loggedInDto: LoggedInDto) {
    return this.repository
    .findOneByOrFail({ id, user: { username: loggedInDto.username }})
    .then(() => this.repository.delete({ id }))
    .catch(() => { throw new NotFoundException(`Not found id=${id}`) });
  }
}
