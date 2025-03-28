import { api, HydrateClient } from "~/trpc/server";
import Container from "~/components/ui/container";

import PostInfo from "./_components/post-info";
import CommentsSection from "./_components/comments-section";

type PostProps = {
  params: {
    id: number;
  };
};

export default async function Post({ params }: PostProps) {
  const { id } = await params;

  void api.post.getPost.prefetch({ id });

  return (
    <HydrateClient>
      <Container className="flex w-full flex-col items-center py-8">
        <PostInfo id={id} />
        <CommentsSection id={id} />
      </Container>
    </HydrateClient>
  );
}
