import { type AppRouterOutput } from "~/server/api/root";

export type UserListResponse = AppRouterOutput["user"]["search"];
export type UserListItem = UserListResponse["items"][number];
