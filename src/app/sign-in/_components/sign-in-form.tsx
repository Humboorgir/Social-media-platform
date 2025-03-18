"use client";

import React, { useState } from "react";

import Button from "~/components/ui/button";
import Input from "~/components/ui/input";
import Text from "~/components/ui/text";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SignInSchema, signInSchema } from "~/lib/schema/sign-in-schema";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({ resolver: zodResolver(signInSchema) });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    setIsLoading(true);

    const signUserIn = async () =>
      await signIn("credentials", {
        ...data,
        redirect: false,
      }).then((res) => {
        // res.code is our custom error message
        if (res?.error) throw new Error(res.code);
        return true;
      });

    toast.promise(signUserIn(), {
      loading: "Authorizing...",
      success: () => {
        router.refresh();
        router.push("/");
        return `Welcome back!`;
      },
      error: (err) => {
        return String(err);
      },
      finally: () => {
        setIsLoading(false);
      },
    });
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
      {["Email", "Password"].map((item, i) => {
        const itemLabel = item;
        const itemName = item.toLowerCase() as keyof SignInSchema;
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
        Don't have an account?{" "}
        <Button className="!p-1" size="sm" variant="ghost" href="/sign-up">
          Sign up
        </Button>
      </Text>

      <Button className="w-full" type="submit" isLoading={isLoading}>
        Sign in
      </Button>
    </form>
  );
}
