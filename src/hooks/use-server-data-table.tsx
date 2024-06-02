"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type TableOptions,
} from "@tanstack/react-table";
import { z } from "zod";

import { usePromise } from "~/hooks/use-promise";
import type { DataTableFilterField } from "~/types/data-table";
import { useMemo, useState } from "react";

interface UseServerDataTableProps<TData extends object> {
  query: Promise<{
    items: TData[];
    count: number;
  }>;
  initialState?: {
    columnFilters?: ColumnFiltersState;
    globalFilter?: string;
    pagination?: PaginationState;
    sorting?: SortingState;
  };
  filterFields: DataTableFilterField<TData>[];
}

const schema = z.object({
  per_page: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  global: z.string().optional(),
});

export function useServerDataTable<TData extends object>({
  query,
  initialState,
  filterFields,
}: UseServerDataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const search = schema.parse(Object.fromEntries(searchParams));
  const page = search.page;
  const limit = search.per_page ?? initialState?.pagination?.pageSize ?? 10;
  const sortColumn = search.sort_by ?? initialState?.sorting?.[0]?.id;
  const sortOrder =
    search.sort_order ?? initialState?.sorting?.[0]?.desc ? "desc" : "asc";
  const initialGlobalFilter = search.global ?? initialState?.globalFilter ?? "";

  const { result, isInitialLoading } = usePromise(query);
  const items = useMemo(() => result?.items ?? [], [result]);
  const count = useMemo(() => result?.count ?? 0, [result]);

  // Split the columns into unique value columns and multi value columns to know which values should be split by dot
  const { uniqueValueColumns, multiValueColumns } = React.useMemo(() => {
    return {
      uniqueValueColumns: filterFields.filter(
        (field) => field.variant === "input",
      ),
      multiValueColumns: filterFields.filter(
        (field) => field.variant === "multiSelect",
      ),
    };
  }, [filterFields]);

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Initial column filters
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        const filterableColumn = multiValueColumns.find(
          (column) => column.value === key,
        );
        const searchableColumn = uniqueValueColumns.find(
          (column) => column.value === key,
        );

        if (filterableColumn) {
          filters.push({
            id: key,
            value: value.split("."),
          });
        } else if (searchableColumn) {
          filters.push({
            id: key,
            value,
          });
        }

        return filters;
      },
      [],
    );
  }, [multiValueColumns, uniqueValueColumns, searchParams]);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [globalFilter, setGlobalFilter] = useState<string>(initialGlobalFilter);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(
    initialState?.pagination ?? {
      pageIndex: page - 1,
      pageSize: limit,
    },
  );

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const [sorting, setSorting] = useState<SortingState>(
    sortColumn ? [{ id: sortColumn, desc: sortOrder === "desc" }] : [],
  );

  const [isMounted, setIsMounted] = useState(false);

  const onPaginationChange: OnChangeFn<PaginationState> = (newPagination) => {
    setPagination(newPagination);

    const newPaginationValue =
      typeof newPagination === "function"
        ? newPagination(pagination)
        : newPagination;

    const pageIndex = newPaginationValue.pageIndex;
    const perPage = newPaginationValue.pageSize;

    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex !== 0 ? pageIndex + 1 : null,
        per_page: perPage,
      })}`,
      {
        scroll: false,
      },
    );
  };

  const onSortingChange: OnChangeFn<SortingState> = (newSorting) => {
    const newSortingValue =
      typeof newSorting === "function" ? newSorting(sorting) : newSorting;
    setSorting(newSortingValue);

    const sortBy = newSortingValue[0]?.id ?? null;
    const sortOrder =
      newSortingValue[0]?.id && newSortingValue[0]?.desc ? "desc" : null;
    setPagination((current) => ({ ...current, pageIndex: 0 }));
    router.push(
      `${pathname}?${createQueryString({
        sort_by: sortBy,
        sort_order: sortOrder,
        page: null,
      })}`,
    );
  };

  const multiValueColumnFilters = columnFilters.filter((filter) => {
    return multiValueColumns.find((column) => column.value === filter.id);
  });

  const uniqueValueColumnFilters = columnFilters.filter((filter) => {
    return uniqueValueColumns.find((column) => column.value === filter.id);
  });

  React.useEffect(() => {
    // avoid to trigger on first mount
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    // Initialize new params
    const newParamsObject = {
      page: 1,
    };

    for (const column of uniqueValueColumnFilters) {
      if (typeof column.value === "string") {
        Object.assign(newParamsObject, {
          [column.id]: column.value,
        });
        continue;
      }

      throw new Error(
        "Invalid unique column filter value: " + column.value?.toString(),
      );
    }

    // Handle filterable column filters
    for (const column of multiValueColumnFilters) {
      if (typeof column.value === "object" && Array.isArray(column.value)) {
        Object.assign(newParamsObject, { [column.id]: column.value.join(".") });
        continue;
      }
      throw new Error(
        "Invalid multi column filter value: " + column.value?.toString(),
      );
    }

    // Remove deleted values
    for (const key of searchParams.keys()) {
      if (
        (uniqueValueColumns.find((column) => column.value === key) &&
          !uniqueValueColumnFilters.find((column) => column.id === key)) ??
        (multiValueColumns.find((column) => column.value === key) &&
          !multiValueColumnFilters.find((column) => column.id === key))
      ) {
        Object.assign(newParamsObject, { [key]: null });
      }
    }

    // After cumulating all the changes, push new params
    router.push(`${pathname}?${createQueryString(newParamsObject)}`);

    setPagination((current) => ({ ...current, pageIndex: 0 }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(uniqueValueColumnFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(multiValueColumnFilters),
  ]);

  const onGlobalFilterChange: OnChangeFn<string> = (newGlobalFilter) => {
    const newGlobalFilterValue =
      typeof newGlobalFilter === "function"
        ? newGlobalFilter(globalFilter)
        : newGlobalFilter;

    if (newGlobalFilterValue === globalFilter) return;

    setGlobalFilter(newGlobalFilterValue);

    setPagination((current) => ({ ...current, pageIndex: 0 }));
    router.push(
      `${pathname}?${createQueryString({
        global: newGlobalFilterValue !== "" ? newGlobalFilterValue : null,
        page: null,
      })}`,
    );
  };

  return {
    data: items,
    rowCount: count,
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      isInitialLoading: isInitialLoading && items.length === 0,
    },
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  } satisfies Partial<TableOptions<TData>>;
}
