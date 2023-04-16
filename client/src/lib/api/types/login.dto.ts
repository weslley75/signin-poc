import { type } from "os";
import { z } from "zod";

export const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export const loginResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nonempty(),
  username: z.string().nonempty(),
  createdAt: z
    .string()
    .nonempty()
    .datetime()
    .transform((v) => new Date(v)),
  updatedAt: z
    .string()
    .nonempty()
    .datetime()
    .transform((v) => new Date(v)),
});


export type LoginPayload = z.infer<typeof loginPayloadSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginResponsePreTransform = Record<keyof LoginResponse, string>;