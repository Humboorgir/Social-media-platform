import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
export default async function Profile() {
  const session = await auth();
  const isLoggedIn = session?.user;

  if (isLoggedIn) redirect(`/profile/${session.user.id}`);
  else redirect("/sign-in");
}
