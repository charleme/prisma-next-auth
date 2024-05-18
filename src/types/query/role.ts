import { type AppRouter } from "~/server/api/root";
import { type inferRouterOutputs } from "@trpc/server";

export type RoleListQueryOutput = inferRouterOutputs<AppRouter>["role"]["list"];
export type RoleLIstQueryOutputItem = RoleListQueryOutput[number];
