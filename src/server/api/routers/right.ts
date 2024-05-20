import {
  createTRPCRouter,
  protectedProcedureByRights,
} from "~/server/api/trpc";
import { Right } from "~/types/enum/Right";

export const rightRouter = createTRPCRouter({
  list: protectedProcedureByRights([Right.VIEW_ROLE]).query(async ({ ctx }) => {
    return ctx.db.right.findMany();
  }),
});
