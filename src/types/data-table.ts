import { type ColumnDef, type RowData } from "@tanstack/react-table";

export type SearchParams = Record<string, string | string[] | undefined>;

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type DataTableFilterField<
  TData extends object,
  TVariant extends
    keyof DataTableFilterFieldVariantsFields = keyof DataTableFilterFieldVariantsFields,
> =
  | ({
      value: keyof TData;
    } & DataTableFilterFieldVariants[TVariant])
  | {
      variant: "global";
      value: "global";
      placeholder: string;
    };

export type ColumnDefWithViewSelectorMeta<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<TData, TValue> & {
  meta?: {
    viewSelector: string | React.ReactNode;
  };
};

type DataTableFilterFieldVariantsFields = {
  input: {
    placeholder: string;
  };
  multiSelect: {
    label: string;
    options: Option[];
  };
  select: {
    label: string;
    options: Option[];
  };
  // Not Implemented yet
  // date: {
  //   placeholder: string;
  // };
};

type DataTableFilterFieldVariants = {
  [K in keyof DataTableFilterFieldVariantsFields]: DataTableFilterFieldVariantsFields[K] & {
    variant: K;
  };
};
