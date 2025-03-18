"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import Posts from "./posts";
import Text from "~/components/ui/text";
import Image from "next/image";
import { cn, getPfpUrl } from "~/lib/utils";
import { useState } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

type PageContentProps = {
  userId: string | number;
};

export default function PageContent({ userId }: PageContentProps) {
  const [user, { isLoading }] = api.auth.getUserInfo.useSuspenseQuery({
    id: userId,
  });

  if (!user) return notFound();

  const [activeTab, setActiveTab] = useState("");

  const pfpUrl = getPfpUrl(userId);
  return (
    <div className="flex w-full max-w-[540px] flex-col items-center py-8 text-center">
      <Image
        className="rounded-full bg-primary/10"
        src={pfpUrl}
        width={150}
        height={150}
        alt={`${user?.name} profile picture`}
      />
      <Text className="mb-4" variant="h1">
        {user?.name}
      </Text>
      <Tabs
        onChange={(active) => setActiveTab(active)}
        className="flex w-full flex-col items-center"
        openByDefault="likes"
      >
        <TabsList className="relative flex-wrap justify-center sm:flex-nowrap">
          <TabsTrigger
            className={cn(
              "sm:w-1/2",
              activeTab == "likes" && "bg-foreground/10",
            )}
            variant="ghost"
            value="likes"
          >
            See liked posts ({user.likedPosts.length})
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              "sm:w-1/2",
              activeTab == "posts" && "bg-foreground/10",
            )}
            variant="ghost"
            value="posts"
          >
            See your own posts ({user.posts.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="likes">
          <Posts posts={user.likedPosts} author={user} />
        </TabsContent>
        <TabsContent value="posts">
          <Posts posts={user.posts} author={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
