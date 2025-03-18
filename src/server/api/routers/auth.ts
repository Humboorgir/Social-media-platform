import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";

import { userSchema } from "~/lib/schema/user-schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(userSchema).mutation(async ({ ctx, input }) => {
    const { name, email, password } = input;
    const existingUser = await ctx.db.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser)
      throw new TRPCError({
        code: "CONFLICT",
        message: "A user with that email already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    await ctx.db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { message: "Account created successfully" };
  }),
  getUserInfo: publicProcedure
    .input(z.object({ id: z.union([z.string(), z.number()]) }))
    .query(async ({ ctx, input }) => {
      const userRequestingOwnInfo = input.id == ctx.session?.user.id;

      const user = await ctx.db.user.findFirst({
        where: {
          id: String(input.id),
        },
        include: {
          comments: userRequestingOwnInfo ? true : false,
          posts: true,
          likedPosts: true,
        },
      });
      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      return user;
    }),
  // getLatest: protectedProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });

  //   return post ?? null;
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
