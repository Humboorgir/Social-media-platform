"use client";

import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "~/components/ui/morphing-popover";
import Button from "~/components/ui/button";
import TextArea from "~/components/ui/textarea";

import { motion } from "framer-motion";
import { createPostSchema } from "~/lib/schema/create-post-schema";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import React, { useRef } from "react";

function Footer() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const utils = api.useUtils();

  const { mutateAsync, isPending } = api.post.create.useMutation({
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

    const parsedData = createPostSchema.safeParse({ content });

    if (parsedData.error)
      return toast.error(parsedData.error?.issues[0]?.message);

    toast.promise(mutateAsync({ ...parsedData.data }), {
      loading: "Creating post...",
      success: (data) => {
        utils.post.invalidate();
        router.push(`/post/${data.id}`);
        return `Post created successfully`;
      },
      error: ({ message }) => {
        return message;
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-[120px] mt-auto py-12"
    >
      <MorphingPopover>
        <MorphingPopoverTrigger asChild>
          <Button className="fixed bottom-[20px]" variant="outline">
            <motion.span
              layoutId="morphing-popover-basic-label"
              layout="position"
            >
              Create your own post
            </motion.span>
          </Button>
        </MorphingPopoverTrigger>
        <MorphingPopoverContent className="flex w-[min(800px,95vw)] flex-col items-end">
          <TextArea
            ref={contentRef}
            rows={6}
            className="mb-3 w-full"
            placeholder="Write something here..."
          />

          <Button isLoading={isPending}>Post</Button>
        </MorphingPopoverContent>
      </MorphingPopover>
    </form>
  );
}

export default Footer;
