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
      include: {
        author: true,
        likedBy: {
          select: { id: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });

    const postsWithIsLike = posts.map((post) => {
      const isLiked = ctx.session
        ? post.likedBy.some((user) => user.id === ctx.session?.user.id)
        : false;

      return Object.assign(post, { isLiked });
    });

    return postsWithIsLike;
  }),
  getOwnPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        authorId: ctx.session.user.id,
      },
      include: {
        author: true,
        likedBy: {
          select: { id: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });

    const postsWithIsLike = posts.map((post) => {
      const isLiked = ctx.session
        ? post.likedBy.some((user) => user.id === ctx.session?.user.id)
        : false;

      return Object.assign(post, { isLiked });
    });

    return postsWithIsLike;
  }),
  getPost: publicProcedure
    .input(z.object({ id: z.union([z.number(), z.string()]) }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: Number(input.id),
        },
        include: {
          author: true,
          comments: true,
          likedBy: { select: { id: true } },
        },
      });
      if (!post)
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });

      const isLiked = ctx.session
        ? post.likedBy.some((user) => user.id === ctx.session?.user.id)
        : false;

      return Object.assign(post, { isLiked });
    }),
  toggleLike: protectedProcedure
    .input(z.object({ postId: z.union([z.number(), z.string()]) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the post exists and if the user has already liked it
      const post = await ctx.db.post.findFirst({
        where: { id: Number(input.postId) },
        select: {
          id: true,
          likedBy: {
            where: { id: userId },
            select: { id: true },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const isLiked = post.likedBy.find((user) => user.id === userId);

      // Toggle the like: connect if not liked, disconnect if liked
      await ctx.db.post.update({
        where: { id: Number(input.postId) },
        data: {
          likedBy: isLiked
            ? { disconnect: { id: userId } }
            : { connect: { id: userId } },
        },
      });

      return { ok: true, isLiked: !isLiked };
    }),
});
