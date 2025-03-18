import { Post, User } from "@prisma/client";
import Image from "next/image";
import Button from "~/components/ui/button";
import Text from "~/components/ui/text";
import { formatDateRelatively, getPfpUrl } from "~/lib/utils";

type OwnPostsProps = {
  posts: Post[];
  // If this is provided, it will be used as the author for all posts
  author: User;
};

export default function OwnPosts({ posts, author }: OwnPostsProps) {
  return (
    <div className="w-full py-4">
      {posts.map((post, i) => {
        const pfpUrl = getPfpUrl(author.id);

        return (
          <Button
            key={i}
            variant="ghost"
            href={`/post/${post.id}`}
            className="relative mb-3 flex w-full flex-col rounded-md border p-3 text-left [mask-image:linear-gradient(180deg,black_70%,transparent)]"
          >
            <div className="mb-2 flex w-full items-center">
              <Image
                className="mr-2 rounded-full bg-primary/10"
                src={pfpUrl.toString()}
                height={45}
                width={45}
                alt={`${author.name} profile picture`}
              />
              <div className="flex flex-col">
                <Text className="mb-0" variant="h4">
                  {author.name}
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
