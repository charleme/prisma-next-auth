import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import {
  MultiSelect,
  type MultiSelectProps,
} from "~/components/molecule/multi-select/multi-select";

export function MultiSelectField<
  TValue,
  TLabel extends string,
  TOption extends object,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  multiSelectProps,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label?: string;
  multiSelectProps: Omit<
    MultiSelectProps<TLabel, TValue, TOption>,
    "onChange" | "onBlur" | "value" | "disabled" | "name" | "ref"
  >;
}) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <MultiSelect controlled={true} {...multiSelectProps} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
