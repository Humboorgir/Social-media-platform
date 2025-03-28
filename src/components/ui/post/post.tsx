"use client";

import type { Post, User } from "@prisma/client";

import Text from "~/components/ui/text";
import Button from "~/components/ui/button";
import Image from "next/image";

import { cn, formatDateRelatively, getPfpUrl } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useRouter } from "nextjs-toploader/app";
import { useLikes } from "~/hooks/useLikes";

import { MessageCircle, Heart } from "lucide-react";

type PostProps = {
  post: Post & {
    author: User;
    comments: { id: number | string }[];
    likedBy: { id: number | string }[];
    isLiked: boolean;
  };
};

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const { isLiked, setIsLiked, likeCount, setLikeCount } = useLikes(post);

  function comment() {
    router.push(`/post/${post.id}`);
  }

  const { mutateAsync, isPending } = api.post.toggleLike.useMutation();
  async function likePost() {
    const { isLiked } = await mutateAsync({ postId: post.id });

    setIsLiked(isLiked);
    setLikeCount((prev) => {
      if (isLiked) return prev + 1;
      return prev - 1;
    });
  }

  return (
    <div className="mb-2 flex w-full max-w-[540px] flex-col rounded-md border pb-3 text-left">
      <Button
        className="flex flex-col p-3 pb-2"
        href={`/post/${post.id}`}
        variant="ghost"
      >
        <div className="mb-2 flex w-full items-center justify-start !p-0">
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
        <Text
          variant="p"
          className="w-full whitespace-pre-wrap break-words [mask-image:linear-gradient(180deg,black_40%,transparent)]"
        >
          {post.content}
        </Text>
      </Button>

      <div className="flex w-full items-center border-t p-2 pb-0">
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
          const shouldBePink = isLiked && id == "like";
          return (
            <Button
              key={id}
              isLoading={isPending}
              variant="ghost"
              onClick={() => action()}
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
        <Button
          className="ml-auto text-blue-700/80"
          size="sm"
          href={`/post/${post.id}`}
          variant="link"
        >
          Show more
        </Button>
      </div>
    </div>
  );
}
