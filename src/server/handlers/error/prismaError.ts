import { type AppErrors } from "~/server/handlers/error/index";
import type { PrismaError } from "~/types/schema/error/prismaError";

export const handlePrismaError = (errorCause: PrismaError): AppErrors => {
  let errorMessage: string | null = null;
  if ("code" in errorCause) {
    switch (errorCause.code) {
      case "P2002":
        errorMessage = "This value is already taken";
        break;

      // Add here other cases for Prisma error codes

      default:
        break;
    }

    if (errorMessage && Array.isArray(errorCause.meta?.target)) {
      const fieldErrors = errorCause.meta.target.reduce<Record<string, string>>(
        (acc, target) => {
          acc[target] = errorMessage!;
          return acc;
        },
        {},
      );

      return {
        formErrors: [],
        fieldErrors,
      };
    }
  }

  return null;
};
