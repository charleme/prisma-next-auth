import { describe, expect, it, vi } from "vitest";
import { useSearchParamsDataTable } from "~/hooks/use-search-params-data-table";
import { renderHook } from "@testing-library/react";
import { flushSync } from "react-dom";

const result = {
  isPending: false,
  data: { items: [{ foo: null, bar: null }], count: 0 },
};

type Query = (...args: unknown[]) => typeof result;

describe("use-server-data-table hook - fetching", () => {
  it("should fetch with the right params without initial state", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters: [] = [];
    const initialState = {};

    renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
        initialState,
      }),
    );

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params with initial state", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [
      {
        variant: "input",
        value: "foo",
        placeholder: "",
      },
      {
        variant: "global",
        value: "global",
        placeholder: "",
      },
    ] as const;
    const initialState = {
      pagination: {
        pageIndex: 1,
        pageSize: 20,
      },
      sorting: {
        id: "test",
        desc: true,
      },
    };

    renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
        initialState,
      }),
    );

    expect(query).toHaveBeenLastCalledWith({
      page: 1,
      per_page: 20,
      sort_by: "test",
      sort_order: "desc",
    });
  });

  it("should fetch with the right params after changing input column filters", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [
      {
        variant: "input",
        value: "foo",
        placeholder: "",
      },
      {
        variant: "input",
        value: "bar",
        placeholder: "",
      },
    ] as const;

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([
        {
          id: "bar",
          value: "test2",
        },
      ]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
      bar: "test2",
    });

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params after changing selectNumber column filters", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [
      {
        variant: "selectNumber",
        value: "foo",
        label: "",
        options: [{ label: "", value: 1 }],
      },
    ] as const;

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([
        {
          id: "foo",
          value: 2,
        },
      ]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
      foo: 2,
    });

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params after changing selectString column filters", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [
      {
        variant: "selectString",
        value: "foo",
        label: "",
        options: [{ label: "", value: "" }],
      },
      {
        variant: "selectString",
        value: "bar",
        label: "",
        options: [{ label: "", value: "" }],
      },
    ] as const;

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([
        {
          id: "foo",
          value: "test",
        },
      ]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
      foo: "test",
    });

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params after changing multiSelectNumber column filters", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [
      {
        variant: "multiSelectNumber",
        value: "foo",
        label: "",
        options: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
        ],
      },
      {
        variant: "multiSelectNumber",
        value: "bar",
        label: "",
        options: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
        ],
      },
    ] as const;

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([
        {
          id: "foo",
          value: [1, 2],
        },
      ]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
      foo: [1, 2],
    });

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params after changing multiSelectString column filters", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [
      {
        variant: "multiSelectString",
        value: "foo",
        label: "",
        options: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
        ],
      },
      {
        variant: "multiSelectString",
        value: "bar",
        label: "",
        options: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
        ],
      },
    ] as const;

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([
        {
          id: "foo",
          value: ["1", "2"],
        },
      ]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
      foo: ["1", "2"],
    });

    flushSync(() => {
      serverDataTableHook.result.current.onColumnFiltersChange([]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params after changing global filter", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [
      {
        variant: "global",
        value: "global",
        placeholder: "",
      },
    ] as const;

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onGlobalFilterChange("test");
    });

    expect(query).toHaveBeenLastCalledWith({
      global: "test",
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });

    flushSync(() => {
      serverDataTableHook.result.current.onGlobalFilterChange("");
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params after changing pagination", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [] as const;
    const initialState = {
      pagination: {
        pageIndex: 1,
        pageSize: 20,
      },
    };

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
        initialState,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onPaginationChange({
        pageIndex: 2,
        pageSize: 10,
      });
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 2,
      per_page: 10,
      sort_by: null,
      sort_order: "asc",
    });
  });

  it("should fetch with the right params after changing sorting", () => {
    const query = vi.fn<Query>().mockReturnValue(result);

    const filters = [] as const;
    const initialState = {
      sorting: {
        id: "test",
        desc: true,
      },
    };

    const serverDataTableHook = renderHook(() =>
      useSearchParamsDataTable({
        filters,
        useQuery: query,
        initialState,
      }),
    );

    flushSync(() => {
      serverDataTableHook.result.current.onSortingChange([
        {
          id: "foo",
          desc: false,
        },
      ]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: "foo",
      sort_order: "asc",
    });

    flushSync(() => {
      serverDataTableHook.result.current.onSortingChange([]);
    });

    expect(query).toHaveBeenLastCalledWith({
      page: 0,
      per_page: 10,
      sort_by: undefined,
      sort_order: "desc",
    });
  });
});
