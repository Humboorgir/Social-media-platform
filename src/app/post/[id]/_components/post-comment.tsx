"use client";

import { useRouter } from "nextjs-toploader/app";
import { useRef } from "react";
import { toast } from "sonner";
import Button from "~/components/ui/button";
import TextArea from "~/components/ui/textarea";
import { createCommentSchema } from "~/lib/schema/create-post--schema";
import { api } from "~/trpc/react";

type PostCommentProps = {
  postId: number;
};

export default function PostComment({ postId }: PostCommentProps) {
  const utils = api.useUtils();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { mutateAsync, isPending } = api.comment.create.useMutation({
    onSuccess(data) {
      return data;
    },
    onError({ message }) {
      throw new Error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = contentRef.current?.value;

    const parsedData = createCommentSchema.safeParse({ content, postId });

    if (parsedData.error)
      return toast.error(parsedData.error?.issues[0]?.message);

    toast.promise(mutateAsync({ ...parsedData.data }), {
      loading: "Posting comment...",
      success: () => {
        utils.comment.invalidate();
        contentRef.current!.value = "";
        return `Comment posted successfully`;
      },
      error: ({ message }) => {
        return message;
      },
    });
  };

  return (
    <form className="mb-4 flex flex-col items-end" onSubmit={handleSubmit}>
      <TextArea
        id="postComment-textarea"
        name="comment-content"
        ref={contentRef}
        className="mb-1 w-full"
        rows={4}
        placeholder="Leave a comment"
      />
      <Button isLoading={isPending} type="submit">
        Post comment
      </Button>
    </form>
  );
}
