import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { type CheckboxProps } from "@radix-ui/react-checkbox";
import { Checkbox } from "~/components/ui/checkbox";

export function CheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  checkboxProps,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label?: string;
  checkboxProps?: CheckboxProps;
}) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              {...checkboxProps}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
