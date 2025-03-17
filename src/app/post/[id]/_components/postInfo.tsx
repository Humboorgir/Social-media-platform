"use client";

import { Post, User } from "@prisma/client";
import { notFound } from "next/navigation";
import Button from "~/components/ui/button";
import Text from "~/components/ui/text";
import { formatDateRelatively } from "~/lib/utils";
import { api } from "~/trpc/react";

type PostInfoProps = {
  id: number;
};

export default function PostInfo({ id }: PostInfoProps) {
  const [post, { isLoading }] = api.post.getPost.useSuspenseQuery({
    id: Number(id),
  });

  if (!post) return notFound();

  return (
    <div className="mb-3 flex w-full max-w-[540px] flex-col rounded-md border p-3">
      <div className="mb-2 flex w-full items-center justify-between">
        <Text className="mr-3" variant="h4">
          {post.author.name}
        </Text>
        <Text className="text-sm text-foreground/60" variant="lead">
          {formatDateRelatively(post.createdAt)}
        </Text>
      </div>
      <Text variant="lead" className="w-full whitespace-pre-wrap break-words">
        {post.content}
      </Text>
    </div>
  );
}
