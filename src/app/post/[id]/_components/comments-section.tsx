"use client";

import { User } from "@prisma/client";
import TextArea from "~/components/ui/textarea";
import { pfpUrlBase } from "~/config";
import { api } from "~/trpc/react";
import { notFound } from "next/navigation";
import Comment from "./comment";
import Text from "~/components/ui/text";
import Badge from "~/components/ui/badge";
import Button from "~/components/ui/button";
import PostComment from "./post-comment";

type CommentsSectionProps = {
  id: number;
};

export default function CommentsSection({ id }: CommentsSectionProps) {
  const [comments, { isLoading }] =
    api.comment.getLatestComments.useSuspenseQuery({ postId: id });

  return (
    <div className="w-full max-w-[540px]">
      <PostComment postId={id} />
      <Badge className="mb-4" variant="secondary">
        {comments.length} Comments
      </Badge>

      {comments.map((comment) => {
        return <Comment comment={comment} key={comment.id} />;
      })}
    </div>
  );
}
