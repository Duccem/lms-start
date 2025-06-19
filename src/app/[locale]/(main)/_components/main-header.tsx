"use client";
import { Separator } from "@/lib/ui/components/separator";
import { SidebarTrigger } from "@/lib/ui/components/sidebar";
import { usePathname } from "next/navigation";

const titles = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    title: "Cursos",
    url: "/admin/courses",
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const currentTitle =
    titles.find((item) => item.url === pathname)?.title || "Documents";
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentTitle}</h1>
      </div>
    </header>
  );
}

