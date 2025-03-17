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
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      return session;
    },
    jwt({ token, user }) {
      if (!user) return token;
      return {
        name: user.name,
        email: user.email,
        id: user.id,
      };
    },
  },
} satisfies NextAuthConfig;
