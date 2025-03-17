import { HydrateClient } from "~/trpc/server";
import PostInfo from "./_components/postInfo";
import Container from "~/components/ui/container";

type PostProps = {
  params: {
    id: number;
  };
};

export default async function Post({ params }: PostProps) {
  const { id } = await params;
  return (
    <HydrateClient>
      <Container className="flex w-full flex-col items-center py-8">
        <PostInfo id={id} />
      </Container>
    </HydrateClient>
  );
}
