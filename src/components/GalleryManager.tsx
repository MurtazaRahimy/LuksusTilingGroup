"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addGalleryImage, deleteGalleryImage, type GalleryFormState } from "@/app/admin/actions";

type GalleryImageData = {
  id: string;
  url: string;
  alt: string;
  tag: "BEFORE" | "AFTER" | "NONE";
};

const initialState: GalleryFormState = {};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-white font-semibold px-5 py-2.5 rounded text-sm hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Uploading…" : "Add Image"}
    </button>
  );
}

export default function GalleryManager({ projectId, images }: { projectId: string; images: GalleryImageData[] }) {
  const boundAction = addGalleryImage.bind(null, projectId);
  const [state, formAction] = useActionState(boundAction, initialState);

  return (
    <div>
      <h2 className="font-heading font-semibold text-lg text-primary mb-3">Gallery</h2>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {images.map((img) => (
            <div key={img.id} className="relative rounded-md overflow-hidden border border-border">
              <div className="relative h-28">
                <Image src={img.url} alt={img.alt} fill className="object-cover" />
              </div>
              {img.tag !== "NONE" && (
                <span className="absolute top-1.5 left-1.5 bg-ink/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                  {img.tag === "BEFORE" ? "Before" : "After"}
                </span>
              )}
              <form
                action={deleteGalleryImage.bind(null, projectId, img.id)}
                className="absolute top-1.5 right-1.5"
                onSubmit={(e) => {
                  if (!window.confirm("Remove this photo from the gallery?")) e.preventDefault();
                }}
              >
                <button
                  type="submit"
                  aria-label="Delete image"
                  className="bg-white/90 text-danger text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center hover:bg-white"
                >
                  ✕
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form action={formAction} className="bg-muted rounded-md p-4 space-y-3">
        {state?.error && (
          <p role="alert" className="bg-danger/10 text-danger text-sm font-medium px-3 py-2 rounded border border-danger/30">
            {state.error}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="gallery-image" className="block text-xs font-semibold text-ink mb-1">
              Image
            </label>
            <input
              id="gallery-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              required
              className="w-full text-sm"
            />
          </div>
          <div>
            <label htmlFor="gallery-tag" className="block text-xs font-semibold text-ink mb-1">
              Tag
            </label>
            <select
              id="gallery-tag"
              name="tag"
              defaultValue="NONE"
              className="w-full border border-border rounded px-2 py-2 text-sm bg-white"
            >
              <option value="NONE">None</option>
              <option value="BEFORE">Before</option>
              <option value="AFTER">After</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="gallery-alt" className="block text-xs font-semibold text-ink mb-1">
            Description (for accessibility)
          </label>
          <input
            id="gallery-alt"
            name="alt"
            type="text"
            placeholder="e.g. Finished bathroom floor tiling"
            className="w-full border border-border rounded px-2 py-2 text-sm bg-white"
          />
        </div>
        <AddButton />
      </form>
    </div>
  );
}
