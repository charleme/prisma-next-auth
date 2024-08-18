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

describe("use-server-data-table hook - column filters state", () => {
  it("should return the correct column filters state without initialState", () => {
    const {
      result: { current: params },
    } = renderHook(() =>
      useMemo(
        () => ({
          filters: [],
          useQuery: useDefaultQuery,
        }),
        [],
      ),
    );
    const serverDataTable = renderHook(() => useSearchParamsDataTable(params));

    expect(serverDataTable.result.current.state.columnFilters).toStrictEqual(
      [],
    );
  });

  it('should update the state when calling "onColumnFilterChange"', async () => {
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

    expect(
      serverDataTableHook.result.current.state.columnFilters,
    ).toStrictEqual(columnFilters);

    const columnFilters2 = [
      {
        id: "test3",
        value: [1, 2],
      },
    ];
    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange(columnFilters2);
    });

    expect(
      serverDataTableHook.result.current.state.columnFilters,
    ).toStrictEqual(columnFilters2);

    const columnFilters3: [] = [];

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange(columnFilters3);
    });

    expect(
      serverDataTableHook.result.current.state.columnFilters,
    ).toStrictEqual(columnFilters3);
  });

  it("should update search params when update column filters", async () => {
    const initialColumnFilters = [
      {
        id: "test",
        value: "test",
      },
    ];
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
      }),
    );
    const searchParamsHook = renderHook(() => useSearchParams());

    const columnFilters = [
      {
        id: "test2",
        value: "test2",
      },
    ];
    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange(columnFilters);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"test2=test2"`,
    );

    const columnFilters2 = [
      {
        id: "test3",
        value: [1, 2],
      },
    ];
    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange(columnFilters2);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"test3=1.2"`,
    );

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([]);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `""`,
    );

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange(
        initialColumnFilters,
      );
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"test=test"`,
    );
  });

  //TODO split test with different filter variants
});
