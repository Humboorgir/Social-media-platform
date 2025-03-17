import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "~/lib/schema/sign-in-schema";

import { db } from "~/server/db";
import * as bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

class CustomError extends CredentialsSignin {
  constructor(error: string) {
    super();
    this.code = error;
  }
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (parsedCredentials.error)
          throw new CustomError(parsedCredentials.error.issues[0]!.message);
        const { email, password } = parsedCredentials.data;

        const user = await db.user.findFirst({
          where: {
            email,
          },
        });
        if (!user) throw new CustomError("User not found");

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) throw new CustomError("Incorrect password");

        return user;
      },
    }),
  ],
  callbacks: {
    session({ token, session }) {
      if (token) {
        session.user.id = token.id;
      }

      return session;
    },
    jwt({ token, user }) {
      if (!user) return token;
      return {
        id: user.id as string,
      };
    },
  },
} satisfies NextAuthConfig;
