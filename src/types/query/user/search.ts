import { type AppRouterOutput } from "~/server/api/root";

export type UserSearchResponse = AppRouterOutput["user"]["search"];
export type UserSearchItem = UserSearchResponse["items"][number];
