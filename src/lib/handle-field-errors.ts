import { type FieldPath, type UseFormReturn } from "react-hook-form";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type TrpcFormatedError } from "~/server/api/trpc";
import { z } from "zod";

type FieldValues = Record<string, unknown>;

export function handleFieldErrors<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>(
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>,
  errors: TRPCClientErrorLike<{
    transformer: true;
    errorShape: TrpcFormatedError;
  }>,
  fieldConvertor?: Record<
    string,
    FieldPath<TFieldValues> | FieldPath<TFieldValues>[]
  >,
) {
  const fieldErrors = errors.data?.errors?.fieldErrors ?? {};

  const parsedFieldErrors = z.record(z.string()).parse(fieldErrors);

  for (const [fieldName, fieldError] of Object.entries(parsedFieldErrors)) {
    const convertedField =
      fieldConvertor?.[fieldName] ?? (fieldName as FieldPath<TFieldValues>);
    const convertedFields = Array.isArray(convertedField)
      ? convertedField
      : [convertedField];

    for (const fieldPath of convertedFields) {
      form.control.setError(fieldPath, {
        type: "custom",
        message: fieldError,
      });
    }
  }
}
