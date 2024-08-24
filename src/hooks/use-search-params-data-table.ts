import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type TableOptions,
} from "@tanstack/react-table";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "~/hooks/use-params";
import { type DataTableServerFilterField } from "~/types/data-table";
import {
  generateUrlSchemaFromFilters,
  type RequestInput,
} from "~/types/schema/list/filters";
import { filterObject } from "~/lib/utils";

// (
//   params: RequestInput<TFilter>,
//   //eslint-disable-next-line @typescript-eslint/no-explicit-any
//   opts?: any,
// )

type BaseQueryResponse = {
  data:
    | {
        items: unknown[] | undefined;
        count: number;
      }
    | undefined;
  isPending: boolean;
};

interface UseSearchParamsDataTableProps<
  TFilters extends Readonly<DataTableServerFilterField[]>,
  TQueryResponse extends BaseQueryResponse,
> {
  filters: TFilters;
  useQuery: (params: RequestInput<TFilters>) => TQueryResponse;
  initialState?: {
    pagination?: PaginationState;
    sorting?: SortingState[number];
  };
}

export function useSearchParamsDataTable<
  TFilters extends Readonly<DataTableServerFilterField[]>,
  TQueryResponse extends BaseQueryResponse,
>({
  filters,
  useQuery,
  initialState,
}: UseSearchParamsDataTableProps<TFilters, TQueryResponse>) {
  const router = useRouter();
  const pathname = usePathname();

  const schema = useMemo(
    () => generateUrlSchemaFromFilters<TFilters>(filters),
    [filters],
  );

  const searchParams = useParams(schema);

  const [lastQueryData, setLastQueryData] = useState<{
    items: NonNullable<NonNullable<TQueryResponse["data"]>["items"]>;
    count: number;
  } | null>(null);

  const initialPage = React.useMemo(
    () => initialState?.pagination?.pageIndex ?? 0,
    [initialState],
  );
  const initialLimit = React.useMemo(
    () => initialState?.pagination?.pageSize ?? 10,
    [initialState],
  );
  const initialSortColumn = React.useMemo(
    () => initialState?.sorting?.id ?? null,
    [initialState],
  );
  const initialSortOrder = React.useMemo(
    () => (initialState?.sorting?.desc ? "desc" : "asc"),
    [initialState],
  );

  const initialValues = React.useMemo(() => {
    return {
      global: "",
      page: initialPage + 1,
      per_page: initialLimit,
      sort_by: initialSortColumn,
      sort_order: initialSortOrder,
    };
  }, [initialPage, initialLimit, initialSortColumn, initialSortOrder]);

  const global =
    "global" in searchParams && searchParams.global !== undefined
      ? searchParams.global?.toString() ?? ""
      : "";
  const page = searchParams.page ?? initialPage + 1;
  const limit =
    searchParams.per_page ?? initialState?.pagination?.pageSize ?? 10;
  const sortColumn = searchParams.sort_by ?? initialSortColumn;
  const sortOrder = searchParams.sort_order ?? initialSortOrder;

  const paginationState: PaginationState = {
    pageIndex: page ? page - 1 : 0,
    pageSize: limit,
  };

  const sortingState: SortingState = sortColumn
    ? [
        {
          id: sortColumn,
          desc: sortOrder === "desc",
        },
      ]
    : [];

  const columnFiltersState: ColumnFiltersState = useMemo(() => {
    const ignoreKeys = ["global", "page", "per_page", "sort_by", "sort_order"];
    // keep only the keys that are not global, page, per_page, sort_by, sort_order

    const columnFilters = Object.entries(searchParams).filter(
      ([key]) => !ignoreKeys.includes(key),
    );

    return [
      ...columnFilters
        .filter(
          ([_, value]) =>
            value !== "" &&
            value !== null &&
            (!Array.isArray(value) || value.length > 0),
        )
        .map(([key, value]) => ({
          value: value as string | string[] | number | number[] | null,
          id: key,
        })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(searchParams)]);

  const queryParams = useMemo(() => {
    const notEmptySearchParams = filterObject(searchParams, (value) => {
      return (
        value !== null &&
        value !== undefined &&
        (Array.isArray(value) ? value.length > 0 : true)
      );
    });

    let sortBy: unknown =
      notEmptySearchParams.sort_by !== "" ? initialSortColumn : undefined;
    if (notEmptySearchParams.sort_by) {
      sortBy = notEmptySearchParams.sort_by;
    }

    return {
      per_page: initialLimit,
      sort_order: initialSortOrder,
      ...notEmptySearchParams,
      page:
        !notEmptySearchParams.page ||
        !Number.isInteger(notEmptySearchParams.page)
          ? initialPage
          : +notEmptySearchParams.page - 1,
      sort_by: sortBy,
    } as unknown as RequestInput<TFilters>;
  }, [
    initialLimit,
    initialPage,
    initialSortColumn,
    initialSortOrder,
    searchParams,
  ]) satisfies RequestInput<TFilters>;

  const query = useQuery(queryParams);

  const queryData = useMemo(() => query.data, [query.data]);

  useEffect(() => {
    if (queryData?.items) {
      setLastQueryData({
        items: queryData.items as NonNullable<
          NonNullable<TQueryResponse["data"]>["items"]
        >,
        count: queryData.count,
      });
    }
  }, [queryData]);

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams();

      for (const [key, value] of [
        ...Object.entries(searchParams),
        ...Object.entries(params),
      ]) {
        if (key in initialValues) {
          const initialValue = initialValues[key as keyof typeof initialValues];
          if (value === initialValue) {
            newSearchParams.delete(key);
            continue;
          }
          if (Array.isArray(value)) {
            if (value.length === 0) {
              newSearchParams.delete(key);
              continue;
            }
            newSearchParams.set(key, value.join("."));
            continue;
          }
          newSearchParams.set(key, value === null ? "" : String(value));
          continue;
        }

        if (value === null || value === undefined) {
          newSearchParams.delete(key);
          continue;
        }
        if (Array.isArray(value)) {
          if (value.length === 0) {
            newSearchParams.delete(key);
            continue;
          }
          newSearchParams.set(key, value.join("."));
          continue;
        }
        newSearchParams.set(key, String(value));
      }

      return newSearchParams.toString();
    },
    [initialValues, searchParams],
  );

  const onPaginationChange: OnChangeFn<PaginationState> = (newPagination) => {
    const newPaginationValue =
      typeof newPagination === "function"
        ? newPagination(paginationState)
        : newPagination;

    const pageIndex = newPaginationValue.pageIndex;
    const perPage = newPaginationValue.pageSize;

    const params = {
      page: pageIndex + 1,
      per_page: perPage,
    };

    router.push(`${pathname}?${createQueryString(params)}`, {
      scroll: false,
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (newSorting) => {
    const newSortingValue =
      typeof newSorting === "function" ? newSorting(sortingState) : newSorting;

    const sortBy = newSortingValue[0]?.id ?? null;
    let sortOrder = initialSortOrder;

    if (sortBy) {
      sortOrder = newSortingValue[0]?.desc ? "desc" : "asc";
    }

    router.push(
      `${pathname}?${createQueryString({
        sort_by: sortBy,
        sort_order: sortOrder,
        page: 1,
      })}`,
    );
  };

  const onGlobalFilterChange: OnChangeFn<string> = (newGlobalFilter) => {
    const newGlobalFilterValue =
      typeof newGlobalFilter === "function"
        ? newGlobalFilter(global)
        : newGlobalFilter;

    if (newGlobalFilter === global) return;

    router.push(
      `${pathname}?${createQueryString({
        global: newGlobalFilterValue ?? "",
        page: 1,
      })}`,
    );
  };

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    newColumnFilters,
  ) => {
    const newColumnFiltersValue =
      typeof newColumnFilters === "function"
        ? newColumnFilters(columnFiltersState)
        : newColumnFilters;

    if (
      JSON.stringify(newColumnFiltersValue) ===
      JSON.stringify(columnFiltersState)
    )
      return;

    const columnFilters = newColumnFiltersValue.reduce(
      (acc, { id, value }) => {
        acc[id] = value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const columnFilterKeys = Object.keys(columnFilters);

    for (const oldColumnFilter of columnFiltersState) {
      if (!columnFilterKeys.includes(oldColumnFilter.id)) {
        columnFilters[oldColumnFilter.id] = null;
      }
    }

    router.push(
      `${pathname}?${createQueryString({
        ...columnFilters,
        page: 1,
      })}`,
    );
  };

  // Reset global filter and column filters with only one route push
  const onResetFilters = () => {
    onColumnFiltersChange([{ id: "global", value: null }]);
  };

  return {
    data: (lastQueryData?.items ?? []) as NonNullable<
      NonNullable<TQueryResponse["data"]>["items"]
    >,
    rowCount: lastQueryData?.count ?? 0,
    initialState: {
      pagination: initialState?.pagination,
      sorting: initialState?.sorting ? [initialState.sorting] : [],
      columnFilters: [],
      globalFilter: "",
    },
    state: {
      pagination: paginationState,
      sorting: sortingState,
      columnFilters: columnFiltersState,
      globalFilter: global,
    },
    meta: {
      isInitialLoading: query.isPending && lastQueryData === null,
      isLoading: query.isPending,
      onResetFilters,
    },
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  } satisfies Partial<
    TableOptions<
      NonNullable<NonNullable<TQueryResponse["data"]>["items"]>[number]
    >
  >;
}
