import SignInForm from "./_components/sign-in-form";

import Container from "~/components/ui/container";
import Text from "~/components/ui/text";

export default async function Home() {
  return (
    <Container className="flex flex-col items-center justify-center">
      <Text className="mb-8" variant="h1">
        Welcome back!
      </Text>
      <SignInForm />
    </Container>
  );
}
