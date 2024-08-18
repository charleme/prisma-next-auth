import { z } from "zod";

export const multiselectOptionsSchema = z
  .string()
  .optional()
  .transform((val) => val?.split("."));
