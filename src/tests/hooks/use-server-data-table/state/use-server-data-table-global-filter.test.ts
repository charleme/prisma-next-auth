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

describe("use-server-data-table hook - global filter state", () => {
  it("should return the correct global filter state without initialState", () => {
    const serverDataTable = renderHook(() =>
      useSearchParamsDataTable({
        filters: [
          {
            variant: "global",
            value: "global",
            placeholder: "",
          },
        ],
        useQuery: useDefaultQuery,
        initialState: {},
      }),
    );

    expect(serverDataTable.result.current.state.globalFilter).toStrictEqual("");
  });

  it('should update the state when calling "onGlobalFilterChange"', async () => {
    const initialGlobalFilter = "test";
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
      }),
    );
    const globalFilter = "test2";
    flushSync(() => {
      serverDataTableResult.result.current.onGlobalFilterChange(globalFilter);
    });

    expect(
      serverDataTableResult.result.current.state.globalFilter,
    ).toStrictEqual(globalFilter);

    flushSync(() => {
      serverDataTableResult.result.current.onGlobalFilterChange(
        initialGlobalFilter,
      );
    });

    expect(
      serverDataTableResult.result.current.state.globalFilter,
    ).toStrictEqual(initialGlobalFilter);
    expect(
      serverDataTableResult.result.current.state.globalFilter,
    ).toStrictEqual(initialGlobalFilter);
  });

  it("should update search params when update global filter state", async () => {
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
      }),
    );
    const searchParamsHook = renderHook(() => useSearchParams());

    const globalFilter = "test2";
    flushSync(() => {
      serverDataTableResult.result.current.onGlobalFilterChange(globalFilter);
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `"global=test2"`,
    );

    flushSync(() => {
      serverDataTableResult.result.current.onGlobalFilterChange("");
    });
    expect(searchParamsHook.result.current.toString()).toMatchInlineSnapshot(
      `""`,
    );
  });
});
