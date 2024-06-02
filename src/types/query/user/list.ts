import { type AppRouterOutput } from "~/server/api/root";

export type UserListResponse = AppRouterOutput["user"]["list"];
export type UserListItem = UserListResponse[number];
