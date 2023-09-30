import { z } from "zod";

export const UsernameSchema = z
  .string()
  .regex(new RegExp(/^[a-zA-Z0-9_-]*$/), {
    message: "Only letters, numbers, dashes (-), and hyphens (_) are allowed",
  })
  .min(3, { message: "Min. 3 Characters" })
  .max(20, { message: "Max. 20 Characters" });

export const EmailSchema = z
  .string()
  .email({ message: "Email address is invalid" })
  .max(50, { message: "Max. 50 Characters" });

export const PasswordSchema = z
  .string()
  .min(6, "Min. 6 Characters")
  .max(50, "Max. 50 Characters");

export const TermsSchema = z.literal(true, {
  errorMap: () => ({ message: "You must accept the terms and conditions" }),
});
