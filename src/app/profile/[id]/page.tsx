import { HydrateClient } from "~/trpc/server";
import Container from "~/components/ui/container";
import Text from "~/components/ui/text";
import { auth } from "~/server/auth";
import PageContent from "./_components/page-content";

type ProfileProps = {
  params: {
    id: string | number;
  };
};

export default async function Profile({ params }: ProfileProps) {
  const { id } = await params;
  const session = await auth();

  return (
    <HydrateClient>
      <Container className="flex w-full flex-col items-center py-8">
        <PageContent userId={id} />
      </Container>
    </HydrateClient>
  );
}
