import Button from "~/components/ui/button";
import Container from "~/components/ui/container";
import Text from "~/components/ui/text";
import { auth } from "~/server/auth";
import UserInfo from "./user-info";

export default async function Navbar() {
  const session = await auth();

  return (
    <header>
      <Container className="flex w-full items-center py-2">
        <Text className="mr-6 whitespace-nowrap" variant="p">
          BoomerHub
        </Text>
        <nav className="flex w-full items-center justify-between">
          <ul>
            <li>
              <Button variant="ghost" href="/">
                Home
              </Button>
            </li>
          </ul>

          <UserInfo user={session?.user} />
        </nav>
      </Container>
    </header>
  );
}
