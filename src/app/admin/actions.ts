"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAuthed } from "@/lib/auth";
import { saveOptimizedImage, ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/images";
import { projectSchema, projectValuesFromFormData, type ProjectFormValues } from "@/lib/project-schema";
import { slugify } from "@/lib/slug";

async function requireAuth() {
  if (!(await isAuthed())) redirect("/admin/login");
}

export type { ProjectFormValues };
export type ProjectFormState = { error?: string; values?: ProjectFormValues };

async function processImageField(formData: FormData, field: string): Promise<string | undefined> {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${field}: file too large (max 5 MB).`);
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error(`${field}: unsupported file type.`);
    return saveOptimizedImage(file);
  }
  return undefined;
}

export async function createProject(_prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  await requireAuth();

  const values = projectValuesFromFormData(formData);
  const parsed = projectSchema.safeParse({
    ...values,
    clientQuote: values.clientQuote || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again.", values };
  }

  let coverImage: string | undefined;
  try {
    coverImage = await processImageField(formData, "coverImage");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed.", values };
  }

  if (!coverImage) {
    return { error: "A cover image is required.", values };
  }

  const baseSlug = slugify(`${parsed.data.title}-${parsed.data.suburb}`);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      type: parsed.data.type as ServiceType,
      slug,
      coverImage,
      coverAlt: `${parsed.data.title} in ${parsed.data.suburb}`,
      clientQuote: parsed.data.clientQuote || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  redirect(`/admin/projects/${project.id}/edit?created=1`);
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAuth();

  const values = projectValuesFromFormData(formData);
  const parsed = projectSchema.safeParse({
    ...values,
    clientQuote: values.clientQuote || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again.", values };
  }

  let coverImage: string | undefined;
  try {
    coverImage = await processImageField(formData, "coverImage");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed.", values };
  }

  await prisma.project.update({
    where: { id },
    data: {
      ...parsed.data,
      type: parsed.data.type as ServiceType,
      clientQuote: parsed.data.clientQuote || null,
      ...(coverImage ? { coverImage, coverAlt: `${parsed.data.title} in ${parsed.data.suburb}` } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects`);
  redirect(`/admin/projects/${id}/edit?saved=1`);
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/admin?deleted=1");
}

export type GalleryFormState = { error?: string };

export async function addGalleryImage(
  projectId: string,
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  await requireAuth();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "File too large (max 5 MB)." };
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Unsupported file type." };
  }

  const tag = formData.get("tag");
  const alt = String(formData.get("alt") ?? "");
  const url = await saveOptimizedImage(file);

  const count = await prisma.galleryImage.count({ where: { projectId } });

  await prisma.galleryImage.create({
    data: {
      projectId,
      url,
      alt,
      tag: tag === "BEFORE" || tag === "AFTER" ? tag : "NONE",
      sortOrder: count,
    },
  });

  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/projects");
  return {};
}

export async function deleteGalleryImage(projectId: string, imageId: string) {
  await requireAuth();
  await prisma.galleryImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/projects");
}

export async function updateEnquiryStatus(id: string, status: string) {
  await requireAuth();
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiry(id: string) {
  await requireAuth();
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/admin/enquiries");
}
