"use client";

import { useState } from "react";
import Button from "~/components/ui/button";
import Text from "~/components/ui/text";
import { formatDateRelatively } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function Posts() {
  const [posts, { isLoading }] = api.post.getLatestPosts.useSuspenseQuery();

  return (
    <div className="w-full py-4">
      {posts.map((post, i) => {
        return (
          <Button
            key={i}
            variant="ghost"
            href={`/post/${post.id}`}
            className="relative mb-3 flex max-w-[540px] flex-col rounded-md border p-3 [mask-image:linear-gradient(180deg,black_70%,transparent)]"
          >
            <div className="mb-2 flex w-full items-center justify-between">
              <Text className="mr-3" variant="h4">
                {post.author.name}
              </Text>
              <Text className="text-sm text-foreground/60" variant="lead">
                {formatDateRelatively(post.createdAt)}
              </Text>
            </div>
            <Text
              variant="lead"
              className="line-clamp-6 w-full whitespace-pre-wrap"
            >
              {post.content}
            </Text>
          </Button>
        );
      })}
    </div>
  );
}
