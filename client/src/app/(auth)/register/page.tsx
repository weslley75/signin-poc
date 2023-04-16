"use client";
import { Inter } from "next/font/google";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/Form";
import { api } from "@/lib/api/api";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const router = useRouter();

  const loginSchema = z
    .object({
      email: z
        .string()
        .email("Email is not valid")
        .trim()
        .nonempty("Email is required"),
      name: z.string().nonempty("Name is required").trim(),
      username: z.string().nonempty("Username is required").trim(),
      password: z
        .string()
        .nonempty("Password is required")
        .min(6, "Password is too short"),
      confirmPassword: z.string().nonempty("Confirm password is required"),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    });

  type LoginSchema = z.infer<typeof loginSchema>;

  const registerForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, formState } = registerForm;

  const { isSubmitting } = formState;

  const onSubmit = async (data: LoginSchema) => {
    const { confirmPassword, ...rest } = data;
    const response = await api.post("/auth/register", rest).catch((err) => {
      alert(err);
    });
    if (response) {
      router.push("/login");
    }
  };

  return (
    <div className={inter.className + "justify-center"}>
      <FormProvider {...registerForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 py-4 px-5 rounded-lg border-2 border-white shadow bg-zinc-900 w-96">
            <h1 className="text-center text-white text-xl">Register</h1>
            <Form.Field>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Input type="text" placeholder="Name" name="name" />
              <Form.ErrorMessage field="name" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Input type="email" placeholder="Email" name="email" />
              <Form.ErrorMessage field="email" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Input type="text" placeholder="Username" name="username" />
              <Form.ErrorMessage field="username" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Input
                type="password"
                placeholder="Password"
                name="password"
              />
              <Form.ErrorMessage field="password" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="confirmPassword">
                Confirm password
              </Form.Label>
              <Form.Input
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
              />
              <Form.ErrorMessage field="confirmPassword" />
            </Form.Field>
            <button
              className="bg-zinc-800 p-2 rounded text-white hover:bg-zinc-700"
              type="submit"
              disabled={isSubmitting}
            >
              Register
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
