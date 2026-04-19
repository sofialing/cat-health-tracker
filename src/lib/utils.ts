import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CatAge } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birthday: string): CatAge {
  const birth = new Date(birthday);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  const label =
    years > 0
      ? `${years}y ${months}m`
      : months > 0
        ? `${months} month${months !== 1 ? "s" : ""}`
        : "< 1 month";
  return { years, months, label };
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatWeight(weight: number, unit: "kg" | "lbs"): string {
  return `${weight} ${unit}`;
}
