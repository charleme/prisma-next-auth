import {
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type TableOptions,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

export function useLazyDataTable<TData>({
  initialState,
  useQuery,
}: {
  initialState?: {
    columnFilters?: ColumnFiltersState;
    globalFilter?: string;
    pagination?: PaginationState;
    sorting?: SortingState;
  };
  useQuery: (
    params: {
      per_page: number;
      page: number;
      global: string;
      sort_by?: string;
      sort_order?: "asc" | "desc";
    } & {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key in keyof NoInfer<TData>]?: any;
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    opts?: any,
  ) => {
    data?: {
      items?: TData[];
      count?: number;
    };
    isPending: boolean;
    isInitialLoading: boolean;
  };
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );
  const [globalFilter, setGlobalFilter] = useState<string>(
    initialState?.globalFilter ?? "",
  );
  const [pagination, setPagination] = useState<PaginationState>(
    initialState?.pagination ?? {
      pageIndex: 0,
      pageSize: 10,
    },
  );
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting ?? [],
  );

  const columnFilterParams = useMemo(() => {
    const columnFilterEntries = columnFilters.map((filter) => {
      return [filter.id, filter.value];
    });

    return Object.fromEntries(columnFilterEntries) as {
      [key in keyof TData]?: unknown;
    };
  }, [columnFilters]);

  const query = useQuery({
    per_page: pagination.pageSize,
    page: pagination.pageIndex + 1,
    global: globalFilter,
    sort_by: sorting[0]?.id,
    sort_order: sorting[0]?.desc ? "desc" : "asc",
    ...columnFilterParams,
  });

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    newColumnFilters,
  ) => {
    setColumnFilters(newColumnFilters);
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
  };

  const onGlobalFilterChange: OnChangeFn<string> = (newGlobalFilter) => {
    setGlobalFilter(newGlobalFilter);
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (newSorting) => {
    setSorting(newSorting);
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
  };

  const [finishedQuery, setFinishedQuery] = useState<
    | {
        items?: TData[];
        count?: number;
      }
    | undefined
  >();

  useEffect(() => {
    if (!query.isPending) {
      setFinishedQuery(query.data);
    }
  }, [query.data, query.isPending]);

  const data = useMemo(
    () => finishedQuery?.items ?? [],
    [finishedQuery?.items],
  );
  const count = useMemo(
    () => finishedQuery?.count ?? 0,
    [finishedQuery?.count],
  );

  return {
    data,
    rowCount: count,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
    meta: {
      isInitialLoading: query.isInitialLoading && data.length === 0,
    },
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  } satisfies Partial<TableOptions<TData>>;
}
