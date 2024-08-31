import { type AppRouterOutput } from "~/server/api/root";

export type PostSearchResponse = AppRouterOutput["post"]["search"];
export type PostSearchItem = PostSearchResponse["items"][number];
