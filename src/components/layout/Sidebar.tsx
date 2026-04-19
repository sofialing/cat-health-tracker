"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cat, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cats", label: "My Cats", icon: Cat },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-64 border-r bg-card/80 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b">
        <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
          <Cat className="size-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">PurrTrack</p>
          <p className="text-[10px] text-muted-foreground">
            Cat health tracker
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className="size-4 flex-shrink-0"
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Add Cat CTA */}
      <div className="px-3 pb-5">
        <Link
          href="/cats/new"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full",
            pathname === "/cats/new"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          <PlusCircle className="size-4 flex-shrink-0" />
          Add a cat
        </Link>
      </div>
    </aside>
  );
}
