"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { saveOptimizedImage, ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/images";
import { notifyNewEnquiry } from "@/lib/email";

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(6, "A valid phone number is required").max(30),
  email: z.string().trim().email("A valid email is required").max(160),
  suburb: z.string().trim().min(1, "Suburb is required").max(120),
  jobType: z.string().trim().min(1, "Job type is required").max(60),
  description: z.string().trim().min(1, "Please describe the job").max(2000),
});

export type EnquiryFormValues = {
  name: string;
  phone: string;
  email: string;
  suburb: string;
  jobType: string;
  description: string;
};

export type EnquiryFieldErrors = Partial<Record<keyof EnquiryFormValues, string>>;

export type EnquiryFormState = {
  error?: string;
  fieldErrors?: EnquiryFieldErrors;
  values?: EnquiryFormValues;
};

function valuesFromFormData(formData: FormData): EnquiryFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    jobType: String(formData.get("jobType") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

export async function submitEnquiry(_prevState: EnquiryFormState, formData: FormData): Promise<EnquiryFormState> {
  const values = valuesFromFormData(formData);

  const parsed = enquirySchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: EnquiryFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof EnquiryFormValues;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors, values };
  }

  let photoUrl: string | undefined;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_UPLOAD_BYTES) {
      return { error: "Photo is too large (max 5 MB).", values };
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(photo.type)) {
      return { error: "Photo must be a JPEG, PNG, WebP, or HEIC image.", values };
    }
    photoUrl = await saveOptimizedImage(photo);
  }

  await prisma.enquiry.create({
    data: { ...parsed.data, photoUrl },
  });

  await notifyNewEnquiry(parsed.data);

  redirect("/contact?success=1");
}
