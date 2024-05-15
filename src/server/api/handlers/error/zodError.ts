import { type ZodError } from "zod";
import { type AppErrors } from "~/server/api/handlers/error/index";

export const handleZodError = (errorCause: ZodError<unknown>): AppErrors => {
  return errorCause.flatten();
};
