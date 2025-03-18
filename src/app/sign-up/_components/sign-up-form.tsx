"use client";

import type { UserSchema } from "~/lib/schema/user-schema";

import React from "react";
import Button from "~/components/ui/button";
import Input from "~/components/ui/input";
import Text from "~/components/ui/text";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "~/lib/schema/user-schema";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export default function SignUpForm() {
  const router = useRouter();
  const { isPending, mutate } = api.auth.signUp.useMutation({
    onSuccess({ message }) {
      toast.success(message);
      // TODO: automatically log user in (show a toast before doing so)
      router.push("/sign-in");
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({ resolver: zodResolver(userSchema) });

  const onSubmit: SubmitHandler<UserSchema> = async (data) => {
    mutate({ ...data });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[min(90vw,400px)] flex-col items-center space-y-2 rounded-md border border-ring p-4"
    >
      <Text className="mb-5 mt-0" variant="h3">
        Sign in
      </Text>

      {/* Form fields  */}
      {["Name", "Email", "Password"].map((item, i) => {
        const itemLabel = item;
        const itemName = item.toLowerCase() as keyof UserSchema;
        return (
          <React.Fragment key={i}>
            <Input
              className="w-full"
              placeholder={itemLabel}
              {...register(itemName)}
            />
            {errors[itemName] && (
              <span className="ml-2 self-start text-xs text-red-600">
                {errors[itemName]?.message}
              </span>
            )}
          </React.Fragment>
        );
      })}

      <Text className="ml-2 self-start text-sm" variant="lead">
        Already have an account?{" "}
        <Button className="!p-1" size="sm" variant="ghost" href="/sign-in">
          Sign in
        </Button>
      </Text>
      <Button className="w-full" type="submit" isLoading={isPending}>
        Sign up
      </Button>
    </form>
  );
}
