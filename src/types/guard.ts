import { type User } from "next-auth";
import { type HandlerDbClient } from "~/server/db";

export type Guard<TInput = undefined> = (params: {
  authUser: User;
  input: TInput;
  db: HandlerDbClient;
}) => boolean | Promise<boolean>;
