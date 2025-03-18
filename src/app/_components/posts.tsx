"use client";

import Post from "~/components/ui/post";
import { api } from "~/trpc/react";

export default function Posts() {
  const [posts, { isLoading }] = api.post.getLatestPosts.useSuspenseQuery();

  return (
    <div className="w-full py-4">
      {posts.map((post, i) => {
        return <Post post={post} key={i} />;
      })}
    </div>
  );
}
