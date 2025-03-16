import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSidebar, BotConvo, ConnectionConvo } from "~/lib/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "~/lib/components/ui/sidebar";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  beforeLoad: async ({ context }) => {
    const { user } = context;
    if (!user) {
      throw redirect({ to: "/signin" });
    } else if (!user.setup_at) {
      throw redirect({ to: "/setup" });
    }

    // re-return to ensure not null
    return { user };
  },
});

const botConvos: BotConvo[] = [
  {
    title: "Test convo 1",
    href: "/app/chats/1",
  },
  {
    title: "Test convo 2",
    href: "/app/chats/2",
  },
];

const connectionConvos: ConnectionConvo[] = [
  {
    title: "Test user 1",
    href: "/app/connections/1",
  },
  {
    title: "Test user 2",
    href: "/app/connections/2",
  },
];

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar botConvos={botConvos} connectionConvos={connectionConvos} />

      <SidebarInset className="p-2">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
