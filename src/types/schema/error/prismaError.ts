import { z } from "zod";

const unknownPrismaError = z.object({
  message: z.string(),
  clientVersion: z.string(),
});

const knownPrismaError = z
  .object({
    code: z.string(),
    meta: z.object({ target: z.array(z.string()) }).optional(),
  })
  .and(unknownPrismaError);

export const prismaErrorSchema = knownPrismaError.or(unknownPrismaError);
export type PrismaError = z.infer<typeof prismaErrorSchema>;
