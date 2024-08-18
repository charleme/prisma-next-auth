import { afterEach, beforeEach, vi } from "vitest";
import { useMemo } from "react";

beforeEach(() => {
  vi.mock("next/navigation", async (importOriginal: <T>() => Promise<T>) => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const actual = await importOriginal<typeof import("next/navigation")>();
    const { useRouter } =
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      await vi.importActual<typeof import("next-router-mock")>(
        "next-router-mock",
      );
    const usePathname = vi.fn().mockImplementation(() => {
      const router = useRouter();
      return router.pathname;
    });
    const useSearchParams = vi.fn().mockImplementation(() => {
      const router = useRouter();
      return useMemo(
        () => new URLSearchParams(router.query as Record<string, string>),
        [router.query],
      );
    });
    return {
      ...actual,
      useRouter: vi.fn().mockImplementation(useRouter),
      usePathname,
      useSearchParams,
    };
  });
});
afterEach(() => {
  vi.clearAllMocks();
});
