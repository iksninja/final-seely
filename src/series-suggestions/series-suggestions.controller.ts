import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpCode, Put, UseInterceptors } from '@nestjs/common';
import { SeriesSuggestionsService } from './series-suggestions.service';
import { CreateSeriesSuggestionDto } from './dto/create-series-suggestion.dto';
import { UpdateSeriesSuggestionDto } from './dto/update-series-suggestion.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { Auth } from '@app/auth/entities/auth.entity';
import { AuthGuard } from '@nestjs/passport';
import { IdDto } from '@app/common/dto/id.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ScoreDto } from './dto/score.dto';
import { ScoresService } from './scores.service';
import { ScoreRemoverInterceptor } from '@app/interceptors/score-remover.interceptor';
import { OptAuthGuard } from '@app/auth/guards/opt-auth.guard';
import { ChkOwnerGuard } from '@app/auth/guards/chk-owner.guard';

@Controller('series-suggestions')
export class SeriesSuggestionsController {
  constructor(
    private readonly seriesSuggestionsService: SeriesSuggestionsService,
    private readonly scoresService: ScoresService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createSeriesSuggestionDto: CreateSeriesSuggestionDto,
    @Req() req: { user: LoggedInDto}
  ) {
    return this.seriesSuggestionsService.create(createSeriesSuggestionDto, req.user);
  }

  @UseGuards(OptAuthGuard)
  @UseInterceptors(ScoreRemoverInterceptor)
  @Get()
  search(@Paginate() query: PaginateQuery) {
    return this.seriesSuggestionsService.search(query);
  }

  @UseGuards(OptAuthGuard)
  @UseInterceptors(ScoreRemoverInterceptor)
  @Get(':id')
  findOne(@Param() idDto: IdDto) {
    return this.seriesSuggestionsService.findOne(idDto.id);
  }

  @UseGuards(AuthGuard('jwt'), ChkOwnerGuard)
  @Patch(':id')
  update(
    @Param() idDto: IdDto, 
    @Body() updateSeriesSuggestionDto: UpdateSeriesSuggestionDto,
    @Req() req: { user: LoggedInDto }
  ) {
    return this.seriesSuggestionsService.update(idDto.id, updateSeriesSuggestionDto, req.user);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), ChkOwnerGuard)
  @Delete(':id')
  remove(
    @Param() idDto: IdDto,
    @Req() req: { user: LoggedInDto }
  ) {
    return this.seriesSuggestionsService.remove(idDto.id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/scores')
  score(
    @Param() idDto: IdDto,
    @Body() scoreDto: ScoreDto,
    @Req() req: { user: LoggedInDto }
  ){
    return this.scoresService.score(idDto.id, scoreDto, req.user);
  }
}
