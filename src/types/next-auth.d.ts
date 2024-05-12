import NextAuth from "next-auth";
import { type JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface User {
    id: number;
    email: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: number;
    email: string;
  }
}

declare module "@auth/core/adapter" {
  interface AdapterUser {
    id: number;
    email: string;
  }
}
