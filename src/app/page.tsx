import Container from "~/components/ui/container";
import Text from "~/components/ui/text";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();
  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await auth();

  // if (session?.user) {
  // void api.post.getLatest.prefetch();
  // }

  return (
    <HydrateClient>
      <Container className="flex flex-col items-center justify-center">
        <Text className="mb-8" variant="h1">
          {session ? `Welcome back ${session?.user.name}!` : "Sign in"}
        </Text>
      </Container>
    </HydrateClient>
  );
}
