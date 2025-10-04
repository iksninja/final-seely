import { createSeriesSuggestionSchema } from './create-series-suggestion.dto';
import { createZodDto } from 'nestjs-zod';

const updateSeriesSuggestionDtoSchema = createSeriesSuggestionSchema.partial()

export class UpdateSeriesSuggestionDto extends createZodDto(updateSeriesSuggestionDtoSchema) {}
