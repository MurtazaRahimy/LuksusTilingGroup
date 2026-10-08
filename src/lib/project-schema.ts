import { z } from "zod";
import { SERVICE_TYPES } from "@/lib/site";

const serviceTypeValues = SERVICE_TYPES.map((s) => s.value) as [string, ...string[]];

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  suburb: z.string().trim().min(1).max(120),
  type: z.enum(serviceTypeValues),
  summary: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(4000),
  scope: z.string().trim().min(1).max(1000),
  materials: z.string().trim().min(1).max(1000),
  duration: z.string().trim().min(1).max(120),
  clientQuote: z.string().trim().max(600).optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export type ProjectFormValues = {
  title: string;
  suburb: string;
  type: string;
  summary: string;
  description: string;
  scope: string;
  materials: string;
  duration: string;
  clientQuote: string;
  featured: boolean;
  published: boolean;
};

export function projectValuesFromFormData(formData: FormData): ProjectFormValues {
  return {
    title: String(formData.get("title") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    type: String(formData.get("type") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    scope: String(formData.get("scope") ?? ""),
    materials: String(formData.get("materials") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    clientQuote: String(formData.get("clientQuote") ?? ""),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}
