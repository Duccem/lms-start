import { getSession } from "@/lib/auth/server";
import { SidebarInset, SidebarProvider } from "@/lib/ui/components/sidebar";
import { redirect } from "next/navigation";
import { AppSidebar } from "./_components/app-sidebar";
import { SiteHeader } from "./_components/main-header";
import { SessionProvider } from "./_components/user-provider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <SessionProvider user={session.user}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}

