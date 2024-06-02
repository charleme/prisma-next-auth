import { type typeToFlattenedError, ZodError } from "zod";
import { prismaErrorSchema } from "~/types/schema/error/prismaError";
import { handleZodError } from "~/server/handlers/error/zodError";
import { handlePrismaError } from "~/server/handlers/error/prismaError";

export type AppErrors = typeToFlattenedError<unknown> | null;

export const handleErrors = (errorCause: unknown): AppErrors => {
  if (errorCause instanceof ZodError) {
    return handleZodError(errorCause);
  }

  const prismaErrorSafeParse = prismaErrorSchema.safeParse(errorCause);
  if (prismaErrorSafeParse.success) {
    return handlePrismaError(prismaErrorSafeParse.data);
  }

  return null;
};
