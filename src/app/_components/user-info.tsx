"use client";

import type { Session } from "next-auth";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Button from "~/components/ui/button";
import Dropdown from "~/components/ui/dropdown";
import { getPfpUrl } from "~/lib/utils";

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
        <Image
          className=""
          width={30}
          height={30}
          src={getPfpUrl(user!.id)}
          alt={`${user!.name} profile picture`}
        />
        {user!.name}
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
