import Container from "~/components/ui/container";
import Text from "~/components/ui/text";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Footer from "./footer";
import Posts from "./posts";

export default async function PageContent() {
  const session = await auth();

  void api.post.getLatestPosts.prefetch();

  return (
    <HydrateClient>
      <Container className="flex flex-col items-center py-8 text-center">
        <Text className="md:text-4xl" variant="h2">
          Welcome back {session?.user.name}!
        </Text>
        <Text className="md:text-lg" variant="lead">
          Explore the latest posts here
        </Text>
        <Posts />
        <Footer />
      </Container>
    </HydrateClient>
  );
}
