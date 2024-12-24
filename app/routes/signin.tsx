import { createFileRoute, redirect } from "@tanstack/react-router";
import { Discord } from "~/lib/components/icons/Discord";
import { Github } from "~/lib/components/icons/Github";
import { Google } from "~/lib/components/icons/Google";
import { Button } from "~/lib/components/ui/button";

export const Route = createFileRoute("/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user?.setup_at) {
      throw redirect({
        to: "/app",
      });
    } else if (context.user) {
      throw redirect({
        to: "/setup",
      });
    }
  },
});

function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8 rounded-xl border bg-muted p-10">
        Varo
        <form method="GET" className="flex flex-col gap-2">
          <Button
            className="bg-[#5865F2] text-white hover:bg-[#5865F2]/80"
            formAction="/api/auth/discord"
            type="submit"
            size="lg"
          >
            <Discord className="mr-2 size-4" />
            Login with Discord
          </Button>
          <Button
            className="bg-[#333333] text-white hover:bg-[#333333]/80"
            formAction="/api/auth/github"
            type="submit"
            size="lg"
          >
            <Github className="mr-2 size-4" />
            Login with GitHub
          </Button>
          <Button
            className="bg-[#DB4437] text-white hover:bg-[#DB4437]/80"
            formAction="/api/auth/google"
            type="submit"
            size="lg"
          >
            <Google className="mr-2 size-4" />
            Login with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
