import Button from "~/components/ui/button";
import Container from "~/components/ui/container";
import Text from "~/components/ui/text";

export default function NotLoggedIn() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <Text className="lg:text-4xl" variant="h2">
        Access Blocked!
      </Text>
      <Text className="mb-5 lg:text-lg" variant="lead">
        You must be signed in to view this page.
      </Text>
      <div className="flex items-center">
        <Button href="/sign-in" className="mr-4">
          Sign in
        </Button>
        <div className="mr-4 h-[40px] w-[2px] bg-black/40" />
        <Button href="/sign-up">Sign up</Button>
      </div>
    </Container>
  );
}
