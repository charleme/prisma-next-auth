"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  loggerLink,
  TRPCClientError,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/root";
import { useToast } from "~/components/ui/use-toast";
import { type TrpcFormatedError } from "~/server/api/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const createQueryClient = (conf?: {
  queryCache?: QueryCache;
  mutationCache?: MutationCache;
}) => new QueryClient(conf);

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = (conf?: {
  queryCache?: QueryCache;
  mutationCache?: MutationCache;
}) => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient(conf);
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient(conf));
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const { toast } = useToast();

  const toastUnkwownError = () =>
    toast({
      title: "Uh! Something went wrong",
      description: "Please try again later",
      variant: "destructive",
    });

  const unauthorizedError = () =>
    toast({
      title: "Unauthorized",
      description: "You need to be logged in to perform this action",
      variant: "destructive",
    });

  const forbiddenError = () =>
    toast({
      title: "Forbidden",
      description: "You don't have permission to perform this action",
      variant: "destructive",
    });

  const queryClient = getQueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof TRPCClientError) {
          const trpcError = error as unknown as TrpcFormatedError;
          switch (trpcError.data.code) {
            case "UNAUTHORIZED":
              return unauthorizedError();
            case "FORBIDDEN":
              return forbiddenError();
            default:
              break;
          }
        }
        toastUnkwownError();
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (error instanceof TRPCClientError) {
          const trpcError = error as unknown as TrpcFormatedError;
          switch (trpcError.data.code) {
            case "UNPROCESSABLE_CONTENT":
              return toast({
                title: "Validation error",
                description: "Please check your input",
                variant: "destructive",
              });
            case "UNAUTHORIZED":
              return unauthorizedError();
            case "FORBIDDEN":
              return forbiddenError();
            default:
              break;
          }
        }

        return toastUnkwownError();
      },
    }),
  });

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
        <ReactQueryDevtools />
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
