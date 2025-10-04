import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SeriesSuggestionsService } from '@app/series-suggestions/series-suggestions.service';

@Injectable()
export class ChkOwnerGuard implements CanActivate {
  constructor(
    private readonly seriesSuggestionsService: SeriesSuggestionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const id = parseInt(req.params.id, 10);

    // if (!user?.username) {
    //   throw new ForbiddenException('Missing user context');
    // }

    // if (isNaN(id)) {
    //   throw new NotFoundException('Invalid series suggestion ID');
    // }

    const suggestion = await this.seriesSuggestionsService.findOne(id);

    if (!suggestion) {
      throw new NotFoundException(`SeriesSuggestion not found: id=${id}`);
    }

    if (suggestion.user?.username !== user.username) {
      throw new ForbiddenException('You are not the owner of this suggestion');
    }

    return true;
  }
}
