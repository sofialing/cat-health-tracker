"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Scale, ChefHat, TriangleAlert, HeartPulse, Wind } from "lucide-react";
const tabs = [
  { label: "Overview", href: "" },
  { label: "Weight", icon: Scale, href: "/weight" },
  { label: "Nutrition", icon: ChefHat, href: "/nutrition" },
  { label: "Breathing", icon: Wind, href: "/breathing" },
  { label: "Incidents", icon: TriangleAlert, href: "/incidents" },
  { label: "Medical", icon: HeartPulse, href: "/medical" },
];

export function CatTabBar({ catId }: { catId: string }) {
  const pathname = usePathname();
  const base = `/cats/${catId}`;

  return (
    <div className="flex overflow-x-auto border-b bg-background sticky top-14 z-30 no-scrollbar">
      {tabs.map(({ label, icon: Icon, href }) => {
        const fullHref = `${base}${href}`;
        const isActive =
          href === "" ? pathname === base : pathname === fullHref;
        return (
          <Link
            key={href}
            href={fullHref}
            className={cn(
              "flex items-center gap-2 shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}

            {label}
          </Link>
        );
      })}
    </div>
  );
}
