"use client";

import { notFound } from "next/navigation";
import Text from "~/components/ui/text";
import { pfpUrlBase } from "~/config";
import { formatDateRelatively } from "~/lib/utils";
import { api } from "~/trpc/react";
import Image from "next/image";

type PostInfoProps = {
  id: number;
};

export default function PostInfo({ id }: PostInfoProps) {
  const [post, { isLoading }] = api.post.getPost.useSuspenseQuery({
    id: Number(id),
  });

  if (!post) return notFound();

  const pfpUrl = new URL(pfpUrlBase);
  pfpUrl.searchParams.set("seed", post.author.id);
  return (
    <div className="mb-2 flex w-full max-w-[540px] flex-col rounded-md border p-3">
      <div className="mb-2 flex w-full items-center">
        <Image
          className="mr-2 rounded-full bg-primary/10"
          src={pfpUrl.toString()}
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
      <Text variant="lead" className="w-full whitespace-pre-wrap break-words">
        {post.content}
      </Text>
    </div>
  );
}
