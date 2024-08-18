import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMemo } from "react";
import { useSearchParamsDataTable } from "~/hooks/use-search-params-data-table";
import { flushSync } from "react-dom";
import { useSearchParams } from "next/navigation";

const useDefaultQuery = () =>
  useMemo(
    () => ({
      isPending: false,
      data: { items: [], count: 0 },
    }),
    [],
  );

describe("use-server-data-table hook - pagination state", () => {
  it("should return the correct pagination state without initialState", () => {
    const {
      result: { current: params },
    } = renderHook(() =>
      useMemo(
        () => ({
          filters: [],
          useQuery: useDefaultQuery,
          initialState: {},
        }),
        [],
      ),
    );
    const serverDataTable = renderHook(() => useSearchParamsDataTable(params));

    const defaultPagination = {
      pageIndex: 0,
      pageSize: 10,
    };

    expect(
      serverDataTable.result.current.initialState.pagination,
    ).toStrictEqual(undefined);
    expect(serverDataTable.result.current.state.pagination).toStrictEqual(
      defaultPagination,
    );
  });

  it("should return the correct pagination state with initialState", () => {
    const pagination = {
      pageIndex: 1,
      pageSize: 20,
    };

    const serverDataTable = renderHook(() =>
      useSearchParamsDataTable({
        filters: [],
        useQuery: useDefaultQuery,
        initialState: {
          pagination: pagination,
        },
      }),
    );

    expect(
      serverDataTable.result.current.initialState.pagination,
    ).toStrictEqual(pagination);
    expect(serverDataTable.result.current.state.pagination).toStrictEqual(
      pagination,
    );
  });

  it('should update the state when calling "onPaginationChange"', async () => {
    const initialPagination = {
      pageIndex: 1,
      pageSize: 20,
    };

    const serverDataTableResult = renderHook(() =>
      useSearchParamsDataTable({
        filters: [],
        useQuery: useDefaultQuery,
        initialState: {
          pagination: initialPagination,
        },
      }),
    );
    const pagination = {
      pageIndex: 2,
      pageSize: 40,
    };

    flushSync(() => {
      serverDataTableResult.result.current.onPaginationChange(pagination);
    });

    expect(
      serverDataTableResult.result.current.initialState.pagination,
    ).toStrictEqual(initialPagination);
    expect(serverDataTableResult.result.current.state.pagination).toStrictEqual(
      pagination,
    );
  });

  it("should update search params when update pagination state", async () => {
    const initialPagination = {
      pageIndex: 1,
      pageSize: 20,
    };

    const serverDataTableResult = renderHook(() =>
      useSearchParamsDataTable({
        filters: [],
        useQuery: useDefaultQuery,
        initialState: {
          pagination: initialPagination,
        },
      }),
    );
    const searchParamsHook = renderHook(() => useSearchParams());

    const pagination1 = {
      pageIndex: 2,
      pageSize: 40,
    };
    flushSync(() => {
      serverDataTableResult.result.current.onPaginationChange(pagination1);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"page=3&per_page=40"`,
    );

    const pagination2 = {
      pageIndex: initialPagination.pageIndex,
      pageSize: 40,
    };
    flushSync(() => {
      serverDataTableResult.result.current.onPaginationChange(pagination2);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"per_page=40"`,
    );

    const pagination3 = {
      pageIndex: 2,
      pageSize: initialPagination.pageSize,
    };
    flushSync(() => {
      serverDataTableResult.result.current.onPaginationChange(pagination3);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"page=3"`,
    );
  });

  it("should reset pagination index to 0 when update sorting", async () => {
    const initialPagination = {
      pageIndex: 1,
      pageSize: 20,
    };
    const initialSorting = {
      id: "name",
      desc: true,
    };

    const serverDataTableResult = renderHook(() =>
      useSearchParamsDataTable({
        filters: [],
        useQuery: useDefaultQuery,
        initialState: {
          pagination: initialPagination,
          sorting: initialSorting,
        },
      }),
    );

    const sorting = {
      id: "lastName",
      desc: false,
    };
    flushSync(() => {
      serverDataTableResult.result.current.onSortingChange([sorting]);
    });

    expect(
      serverDataTableResult.result.current.state.pagination.pageIndex,
    ).toBe(0);
    expect(serverDataTableResult.result.current.state.pagination.pageSize).toBe(
      initialPagination.pageSize,
    );
  });

  it("should reset pagination index to 0 when update global filter", async () => {
    const initialPagination = {
      pageIndex: 1,
      pageSize: 20,
    };

    const serverDataTableResult = renderHook(() =>
      useSearchParamsDataTable({
        filters: [
          {
            variant: "global",
            value: "global",
            placeholder: "",
          },
        ],
        useQuery: useDefaultQuery,
        initialState: {
          pagination: initialPagination,
        },
      }),
    );

    const globalFilter = "test2";
    flushSync(() => {
      serverDataTableResult.result.current.onGlobalFilterChange(globalFilter);
    });

    expect(
      serverDataTableResult.result.current.state.pagination.pageIndex,
    ).toBe(0);
    expect(serverDataTableResult.result.current.state.pagination.pageSize).toBe(
      initialPagination.pageSize,
    );
  });

  it("should reset pagination index to 0 when update column filters", async () => {
    const initialPagination = {
      pageIndex: 1,
      pageSize: 20,
    };

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters: [
          {
            variant: "input",
            value: "test",
            placeholder: "",
          },
          {
            variant: "input",
            value: "test2",
            placeholder: "",
          },
          {
            variant: "multiSelectNumber",
            value: "test3",
            options: [
              {
                label: "1",
                value: 1,
              },
              {
                label: "2",
                value: 2,
              },
            ],
            label: "",
          },
        ],
        useQuery: useDefaultQuery,
        initialState: {
          pagination: initialPagination,
        },
      }),
    );

    const columnFilters = [
      {
        id: "test2",
        value: "test2",
      },
    ];
    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange(columnFilters);
    });

    expect(serverDataTableHook.result.current.state.pagination.pageIndex).toBe(
      0,
    );
    expect(serverDataTableHook.result.current.state.pagination.pageSize).toBe(
      initialPagination.pageSize,
    );
  });
});
