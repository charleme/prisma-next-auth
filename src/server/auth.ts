import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "~/server/db";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";

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
                name: true,
                rights: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
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
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      const jwtUser = user as User;

      if (user?.id && user.email) {
        token = { ...token, ...jwtUser };
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
  return sessions?.user;
};