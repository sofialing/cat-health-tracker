"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cat, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cats", label: "Cats", icon: Cat },
  { href: "/cats/new", label: "Add Cat", icon: PlusCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/80 backdrop-blur-md border-t safe-area-pb lg:hidden">
      <div className="flex h-16 max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-all"
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-xl w-10 h-7 transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" strokeWidth={isActive ? 2.5 : 1.75} />
              </div>
              <span
                className={cn(
                  "text-[10px]",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
