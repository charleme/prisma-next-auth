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

describe("use-server-data-table hook - sorting state", () => {
  it("should return the correct sorting state without initialState", () => {
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

    expect(serverDataTable.result.current.initialState.sorting).toStrictEqual(
      [],
    );
    expect(serverDataTable.result.current.state.sorting).toStrictEqual([]);
  });

  it("should return the correct sorting state with initialState", () => {
    const sorting = {
      id: "name",
      desc: true,
    };
    const filters: [] = [];
    const initialState = {
      sorting,
    };
    const serverDataTable = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: useDefaultQuery,
        initialState: initialState,
      }),
    );

    expect(serverDataTable.result.current.initialState.sorting).toStrictEqual([
      sorting,
    ]);
    expect(serverDataTable.result.current.state.sorting).toStrictEqual([
      sorting,
    ]);
  });

  it('should update the state when calling "onSortingChange"', async () => {
    const initialSorting = {
      id: "firstName",
      desc: true,
    };
    const serverDataTableResult = renderHook(() =>
      useSearchParamsDataTable({
        filters: [],
        useQuery: useDefaultQuery,
        initialState: {
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
      serverDataTableResult.result.current.initialState.sorting,
    ).toStrictEqual([initialSorting]);
    expect(serverDataTableResult.result.current.state.sorting).toStrictEqual([
      sorting,
    ]);

    flushSync(() => {
      serverDataTableResult.result.current.onSortingChange([initialSorting]);
    });
    expect(
      serverDataTableResult.result.current.initialState.sorting,
    ).toStrictEqual([initialSorting]);
    expect(serverDataTableResult.result.current.state.sorting).toStrictEqual([
      initialSorting,
    ]);
  });

  it("should update search params when update sorting state", async () => {
    const initialSorting = {
      id: "name",
      desc: true,
    };

    const serverDataTableResult = renderHook(() =>
      useSearchParamsDataTable({
        filters: [],
        useQuery: useDefaultQuery,
        initialState: {
          sorting: initialSorting,
        },
      }),
    );
    const searchParamsHook = renderHook(() => useSearchParams());

    const sorting1 = [
      {
        id: "firstName",
        desc: false,
      },
    ];
    flushSync(() => {
      serverDataTableResult.result.current.onSortingChange(sorting1);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"sort_by=firstName&sort_order=asc"`,
    );

    const sorting2 = [
      {
        id: "lastName",
        desc: initialSorting.desc,
      },
    ];

    flushSync(() => {
      serverDataTableResult.result.current.onSortingChange(sorting2);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"sort_by=lastName"`,
    );

    flushSync(() => {
      serverDataTableResult.result.current.onSortingChange([]);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"sort_by="`,
    );

    flushSync(() => {
      serverDataTableResult.result.current.onSortingChange([initialSorting]);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `""`,
    );
  });
});
