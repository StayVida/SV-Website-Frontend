"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/layouts/NavBar";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHeroPage = pathname ? ["/", "/about", "/contact"].includes(pathname) : false;

  return (
    <>
      <NavBar />
      <main className={cn("flex-1", !isHeroPage && "pt-16 md:pt-20")}>
        {children}
      </main>
    </>
  );
}
