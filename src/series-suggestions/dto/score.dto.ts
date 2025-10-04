import { createZodDto } from "nestjs-zod";
import z from "zod";

export const scoreDtoSchema = z.object({
    score: z
    .number()
    .int()
    .min(1, 'score must be a number between 1-10')
    .max(10, 'score must be a number between 1-10')
})
export class ScoreDto extends createZodDto(scoreDtoSchema) {}
