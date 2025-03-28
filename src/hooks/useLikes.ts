import type { Post } from "@prisma/client";
import { useEffect, useState } from "react";

export function useLikes(post: Post & { isLiked: boolean; likedBy: any[] }) {
  const postLikeCount = post.likedBy.length;
  const isPostLiked = post.isLiked;

  const [isLiked, setIsLiked] = useState(isPostLiked);
  const [likeCount, setLikeCount] = useState(postLikeCount);

  useEffect(() => {
    setIsLiked(isPostLiked);
    setLikeCount(postLikeCount);
  }, [isPostLiked, postLikeCount]);

  return { isLiked, setIsLiked, likeCount, setLikeCount };
}
