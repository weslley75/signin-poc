import { z } from "zod";

export const registerPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
  name: z.string().nonempty(),
  username: z.string().nonempty(),
});




