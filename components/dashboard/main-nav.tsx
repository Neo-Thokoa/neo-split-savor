"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { WalletCards } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/dashboard",
      text: "Dashboard",
    },
    {
      href: "/dashboard/expenses",
      text: "Expenses",
    },
    {
      href: "/dashboard/settings",
      text: "Settings",
    },
  ];

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <WalletCards className="h-6 w-6" />
        <span className="font-bold inline-block">SplitSavor</span>
      </Link>
      <nav className="flex gap-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.text}
          </Link>
        ))}
      </nav>
    </div>
  );
}