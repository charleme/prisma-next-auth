import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "~/server/db";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { hasAtLeastOneRole, hasRole } from "~/lib/has-role";
import { type Role } from "~/types/enum/Role";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, _) {
        const user = await db.user.findUnique({
          where: { email: credentials?.email },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: true,
            roles: {
              select: {
                id: true,
              },
            },
          },
        });

        const password = credentials?.password ?? "";
        if (!user) {
          // bcrypt Compare to hide there is no user
          await compare(password, "");
          return null;
        }

        if (await compare(password, user.password)) {
          const { password: _, roles, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            roles: roles.map((role) => role.id),
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // refresh token
      if (trigger === "update") {
        const updatedUser = await db.user.findUniqueOrThrow({
          where: { id: user?.id || token.id },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: {
              select: {
                id: true,
              },
            },
          },
        });

        const roleIds = updatedUser.roles.map((role) => role.id);

        token = { ...token, ...user, roles: roleIds };
      } else if (user?.id && user.email) {
        token = { ...token, ...user };
      }

      return token;
    },
    session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);

export const getAuthUser = async () => {
  const sessions = await getServerAuthSession();
  const user = sessions?.user;
  return {
    user,
    hasAtLeastOneRight: (roles: Role[]) =>
      !!user && hasAtLeastOneRole(user, roles),
    hasRight: (role: Role) => !!user && hasRole(user, role),
  };
};
