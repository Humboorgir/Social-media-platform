"use client";

import { notFound } from "next/navigation";
import Text from "~/components/ui/text";
import { pfpUrlBase } from "~/config";
import { cn, formatDateRelatively, getPfpUrl } from "~/lib/utils";
import { api } from "~/trpc/react";
import Image from "next/image";

import { ArrowLeft, MessageCircle, Heart } from "lucide-react";
import Button from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useLikes } from "~/hooks/useLikes";

type PostInfoProps = {
  id: number;
};

export default function PostInfo({ id }: PostInfoProps) {
  const [post, { isLoading }] = api.post.getPost.useSuspenseQuery({
    id: id,
  });

  if (!post) return notFound();

  const { isLiked, setIsLiked, likeCount, setLikeCount } = useLikes(post);

  function comment() {
    const postCommentTextArea = document.getElementById("postComment-textarea");
    postCommentTextArea?.focus();
  }

  const { mutateAsync, isPending } = api.post.toggleLike.useMutation();
  async function likePost() {
    const { isLiked } = await mutateAsync({ postId: id });
    setIsLiked(isLiked);
    setLikeCount((prev) => {
      if (isLiked) return prev + 1;
      return prev - 1;
    });
  }

  return (
    <div className="mb-2 flex w-full max-w-[540px] flex-col rounded-md border p-3">
      <Button
        href={"/"}
        className="mb-1 flex w-fit items-center text-sm text-foreground-muted"
        variant="link"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
      </Button>
      <div className="mb-2 flex w-full items-center">
        <Image
          className="mr-2 rounded-full bg-primary/10"
          src={getPfpUrl(post.author.id)}
          height={45}
          width={45}
          alt={`${post.author.name} profile picture`}
        />
        <div className="flex flex-col">
          <Text className="mb-0" variant="h4">
            {post.author.name}
          </Text>
          <Text
            className="mt-0 text-[13px] text-foreground/60 sm:text-sm"
            variant="lead"
          >
            {formatDateRelatively(post.createdAt)}
          </Text>
        </div>
      </div>
      <Text variant="p" className="w-full whitespace-pre-wrap break-words">
        {post.content}
      </Text>
      <div className="mt-2 flex w-full items-center border-t pt-2">
        {[
          {
            Icon: MessageCircle,
            action: comment,
            id: "comment",
            content: post.comments.length,
          },
          {
            Icon: Heart,
            action: likePost,
            id: "like",
            content: likeCount,
          },
        ].map(({ Icon, action, content, id }) => {
          const shouldBePink = id === "like" && isLiked;
          return (
            <Button
              isLoading={isPending}
              variant="ghost"
              onClick={() => action()}
              key={id}
              className={cn(
                "mr-2.5 flex items-end !p-2 text-foreground-muted",
                shouldBePink && "bg-pink-500/20",
              )}
            >
              <Icon
                className={cn("mr-1 h-5 w-5", shouldBePink && "text-pink-500")}
              />
              <span
                className={cn(
                  "text-sm leading-[24px]",
                  shouldBePink && "text-pink-500",
                )}
              >
                {content}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
