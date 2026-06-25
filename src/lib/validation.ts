import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  enquiryType: z
    .enum(["New business", "General enquiry", "Careers", "Press"])
    .default("General enquiry"),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // Honeypot. Real users never fill this in.
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Strip CR/LF so values can never be used for header injection.
export function sanitiseLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}
