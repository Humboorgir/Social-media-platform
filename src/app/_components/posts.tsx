"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Post from "~/components/ui/post";
import Skeleton from "~/components/ui/skeleton";
import Text from "~/components/ui/text";
import { api } from "~/trpc/react";

export default function Posts() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sentinelRef);

  const [{ pages }, { isFetching, fetchNextPage, hasNextPage }] =
    api.post.getLatestPosts.useSuspenseInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (!isFetching) fetchNextPage();
  }, [inView]);

  return (
    <div className="w-full py-4">
      {pages.map(({ posts }, i) => {
        return posts.map((post, j) => {
          return <Post post={post} key={`${i}-${j}`} />;
        });
      })}

      {/* sentinel  */}
      {hasNextPage && (
        <div className="mt-8 p-2" ref={sentinelRef}>
          <Text variant="lead" className="mb-4 w-full animate-pulse text-left">
            Loading...
          </Text>
          {/* A Skeleton that looks like a post */}
          <div className="mb-6">
            <div className="mb-3 flex">
              <Skeleton className="mr-2 h-12 w-12 rounded-full" />
              <div className="flex w-[120px] flex-col">
                <Skeleton className="mb-1 h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      )}
    </div>
  );
}
