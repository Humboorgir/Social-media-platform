import SignUpForm from "./_components/sign-up-form";

import Container from "~/components/ui/container";
import Text from "~/components/ui/text";

export default async function Home() {
  return (
    <Container className="flex flex-col items-center justify-center">
      <Text className="mb-8" variant="h1">
        Welcome back!
      </Text>
      <SignUpForm />
    </Container>
  );
}
