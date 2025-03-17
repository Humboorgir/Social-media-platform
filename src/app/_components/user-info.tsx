"use client";

import type { Session } from "next-auth";

import { signOut } from "next-auth/react";
import Button from "~/components/ui/button";
import Dropdown from "~/components/ui/dropdown";

type UserInfoProps = {
  user?: Session["user"];
};

export default function UserInfo({ user }: UserInfoProps) {
  const isLoggedIn = Boolean(user);

  if (isLoggedIn)
    return (
      <Dropdown
        variant="outline"
        links={[
          { name: "Profile", href: "/profile" },
          {
            name: "Sign out",
            onClick: () => signOut({ redirectTo: "/sign-in" }),
          },
        ]}
      >
        {user?.name}
      </Dropdown>
    );

  return (
    <ul className="flex space-x-1">
      <li>
        <Button href="/sign-in">Sign in</Button>
      </li>
      <li>
        <Button variant="outline" href="/sign-up">
          Sign up
        </Button>
      </li>
    </ul>
  );
}
