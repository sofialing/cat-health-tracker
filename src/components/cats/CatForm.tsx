"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera } from "lucide-react";
import { uploadToStorage } from "@/lib/cloudinary";
import { createCat, updateCat } from "@/lib/actions/cats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Cat } from "@/types";

interface CatFormProps {
  cat?: Cat;
}

export function CatForm({ cat }: CatFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(
    cat?.profilePicture ?? null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (imageFile) {
        try {
          const url = await uploadToStorage(imageFile);
          formData.set("profilePicture", url);
        } catch (err) {
          console.warn("Image upload failed, saving without photo:", err);
        }
      } else if (cat?.profilePicture) {
        formData.set("profilePicture", cat.profilePicture);
      }

      if (cat) {
        await updateCat(cat.id, formData);
        router.push(`/cats/${cat.id}`);
      } else {
        const { id } = await createCat(formData);
        router.push(`/cats/${id}`);
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <label htmlFor="picture" className="cursor-pointer group">
          <div className="relative size-24 rounded-full overflow-hidden bg-muted border-2 border-dashed border-border group-hover:border-primary transition-colors">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                sizes="96px"
                className="object-cover"
                unoptimized={preview.startsWith("blob:")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-1 text-muted-foreground">
                <Camera className="size-6" />
                <span className="text-xs">Photo</span>
              </div>
            )}
          </div>
          <input
            id="picture"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />
        </label>
        <p className="text-xs text-muted-foreground">Tap to add a photo</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Luna"
          defaultValue={cat?.name}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="birthday">Birthday</Label>
        <Input
          id="birthday"
          name="birthday"
          type="date"
          defaultValue={cat?.birthday}
          required
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="weight">Initial weight</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 4.2"
            defaultValue={cat?.initialWeight}
            required
          />
        </div>
        <div className="w-28 space-y-1.5">
          <Label htmlFor="unit">Unit</Label>
          <Select name="unit" defaultValue={cat?.weightUnit ?? "kg"}>
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={pending}>
          {pending ? "Saving…" : cat ? "Save changes" : "Add cat"}
        </Button>
      </div>
    </form>
  );
}

interface CatFormProps {
  cat?: Cat;
}
