"use client";
import { Inter } from "next/font/google";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/Form";
import { api } from "@/lib/api/api";
import { useRouter } from "next/navigation";
import { useIsUserLogged } from "@/lib/hooks/isUserLogged";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {

  const { isLoggedIn } = useIsUserLogged();

  const router = useRouter();

  const loginSchema = z.object({
    username: z.string().nonempty("Username is required").trim(),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password is too short"),
  });

  type LoginSchema = z.infer<typeof loginSchema>;

  const createLoginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, formState } = createLoginForm;

  const onSubmit = async (data: LoginSchema) => {
    await api.post("/auth/login", data).catch((err) => {
      alert(err);
    });
    router.push("/");
  };

  if (isLoggedIn) {
    router.push("/");
  }

  return (
    <div className={inter.className}>
      <FormProvider {...createLoginForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 py-4 px-5 rounded-lg border-2 border-white shadow bg-zinc-900 w-96">
            <h1 className="text-center text-white text-xl">Login</h1>
            <Form.Field>
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Input name="username" type="text" placeholder="Username" />
              <Form.ErrorMessage field="username" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Input
                name="password"
                type="password"
                placeholder="Password"
              />
              <Form.ErrorMessage field="password" />
            </Form.Field>
            <button
              className="bg-zinc-200 dark:bg-zinc-800 p-2 rounded dark:text-white dark:hover:bg-zinc-700 hover:bg-zinc-300"
              type="submit"
              disabled={formState.isSubmitting}
            >
              Login
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
