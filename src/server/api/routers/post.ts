import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createPostSchema } from "~/lib/schema/create-post-schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.post.create({
          data: {
            ...input,
            author: { connect: { id: ctx.session.user.id } },
          },
        });
        return post;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save post",
        });
      }
    }),
  getLatestPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });

    return posts;
  }),
  getOwnPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        authorId: ctx.session.user.id,
      },
      include: { author: true },
    });

    return posts;
  }),
  getPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.id,
        },
        include: { author: true },
      });

      return post;
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
