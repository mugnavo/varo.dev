import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/setup")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/",
      });
    } else if (context.user.setup_at) {
      throw redirect({
        to: "/app",
      });
    }
  },
  component: SetupPage,
});

function SetupPage() {
  return <div>Hello /setup!</div>;
}
