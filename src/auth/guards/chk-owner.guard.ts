import { SeriesSuggestionsService } from '@app/series-suggestions/series-suggestions.service';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChkOwnerGuard implements CanActivate {

  constructor(
    private readonly seriesSuggestionsService: SeriesSuggestionsService
  ) {}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const id = req.id;

    const seriesSuggestionsService = await this.seriesSuggestionsService.findOne(id);

    if (!seriesSuggestionsService) {
      throw new NotFoundException(`SeriesSuggestion not found: id=${id}`);
    }
    if (seriesSuggestionsService.user?.username !== user.username) {
        throw new ForbiddenException(`You are not the owner of this suggestion`);
    }
  return true;
  }
}
