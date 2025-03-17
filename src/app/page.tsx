import { auth } from "~/server/auth";
import PageContent from "./_components/page-content";
import NotLoggedIn from "./_components/not-logged-in";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = session?.user;

  return <>{isLoggedIn ? <PageContent /> : <NotLoggedIn />}</>;
}
