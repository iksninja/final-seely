import { createZodDto } from "nestjs-zod";
import z from "zod";
import { scoreDtoSchema } from "./score.dto";

export const createSeriesSuggestionSchema = z.object({
    name: z.string().min(1, 'name is required'),
    year: z.string().length(4, 'year is required'),
    description: z.string().min(1, 'name is required'),
    rating: z.object({
        id: z
            .number()
            .int()
            .min(1, 'rating.id must be a number between 1-6')
            .max(6, 'rating.id must be a number between 1-6')
    }),
    score: z.number().int()
})
    .strict();


export class CreateSeriesSuggestionDto extends createZodDto(createSeriesSuggestionSchema) { }
