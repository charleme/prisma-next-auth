import { type ColumnDef, type RowData } from "@tanstack/react-table";

export type SearchParams = Record<string, string | string[] | undefined>;

export interface Option<TValue extends string | number = string | number> {
  label: string;
  value: TValue;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type Variants = keyof DataTableFilterFieldVariantsFields;

export type DataTableServerFilterField = DataTableFilterField<never>;

export type DataTableFilterField<
  TData extends object,
  TVariant extends Variants = Variants,
> = DataTableFilterFieldVariants<TData>[TVariant];

export type ColumnDefWithViewSelectorMeta<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<TData, TValue> & {
  meta?: {
    viewSelector: string | React.ReactNode;
  };
};

export type DataTableFilterFieldVariantsFields = {
  global: {
    value: "global";
    placeholder: string;
  };
  input: {
    placeholder: string;
  };
  multiSelectString: {
    label: string;
    options: Readonly<[Option<string>, ...Option<string>[]]>;
  };
  multiSelectNumber: {
    label: string;
    options: Readonly<[Option<number>, ...Option<number>[]]>;
  };
  selectString: {
    label: string;
    options: Readonly<[Option<string>, ...Option<string>[]]>;
  };
  selectNumber: {
    label: string;
    options: Readonly<[Option<number>, ...Option<number>[]]>;
  };
  checkbox: {
    label: string;
  };
  // Not Implemented yet
  // date: {
  //   placeholder: string;
  // };
};

export type DataTableFilterFieldVariants<TData extends object> = {
  [K in keyof DataTableFilterFieldVariantsFields]: {
    value: K extends "global" ? "global" : keyof TData;
    hide?: boolean;
    variant: K;
  } & DataTableFilterFieldVariantsFields[K];
};
