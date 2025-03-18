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
      if (!ctx.session) return post;
      const isPostLiked = post.likedBy.find(
        (user) => user.id == ctx.session?.user.id,
      );
      if (!isPostLiked) return post;

      return { ...post, isLiked: true };
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
      if (!ctx.session) return post;
      const isPostLiked = post.likedBy.find(
        (user) => user.id == ctx.session?.user.id,
      );
      if (!isPostLiked) return post;

      return { ...post, isLiked: true };
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

      if (!ctx.session) return post;
      const isPostLiked = post.likedBy.find(
        (user) => user.id == ctx.session?.user.id,
      );
      if (!isPostLiked) return post;

      return { ...post, isLiked: true };
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
