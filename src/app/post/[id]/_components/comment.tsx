import { formatDateRelatively } from "~/lib/utils";
import Image from "next/image";
import Text from "~/components/ui/text";
import { Comment as CommentType, User } from "@prisma/client";
import { pfpUrlBase } from "~/config";

type CommentProps = {
  comment: CommentType & {
    author: User;
  };
};
export default function Comment({ comment }: CommentProps) {
  const pfpUrl = new URL(pfpUrlBase);
  pfpUrl.searchParams.set("seed", comment.author.id!);
  return (
    <div key={comment.id} className="mb-5 flex w-full">
      <Image
        className="mr-2 h-[45px] w-[45px] shrink-0 rounded-full bg-primary/10"
        src={pfpUrl.toString()}
        height={45}
        width={45}
        alt={`${comment.author.name} profile picture`}
      />
      <div className="">
        <div className="flex items-center">
          <Text className="my-0 mr-2" variant="h5">
            {comment.author.name}
          </Text>
          <Text
            className="my-0 text-[13px] text-foreground/60 sm:text-sm"
            variant="lead"
          >
            {formatDateRelatively(comment.createdAt)}
          </Text>
        </div>
        <Text variant="lead" className="w-full whitespace-pre-wrap">
          {comment.content}
        </Text>
      </div>
    </div>
  );
}
