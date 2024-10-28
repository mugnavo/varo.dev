import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Home, Inbox } from "lucide-react";
import { AppSidebar, SidebarItem } from "~/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export const Route = createFileRoute("/app")({
  component: DashboardLayout,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
});

const items: SidebarItem[] = [
  {
    title: "Varobot",
    href: "/app",
    icon: Home,
  },
  {
    title: "Connections",
    icon: Inbox,
    submenu: [
      {
        title: "Test user 1",
        href: "/app/connections/1",
      },
      {
        title: "Test user 2",
        href: "/app/connections/2",
      },
    ],
  },
];

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar items={items} />

      <SidebarInset className="p-2">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
