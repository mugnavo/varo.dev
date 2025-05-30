import { redirect } from "@tanstack/react-router";
import { type ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth/auth-client";
import { cn } from "~/lib/utils";

const REDIRECT_URL = "/app";

export const Route = createFileRoute({
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
      <div className="bg-card flex flex-col items-center gap-8 rounded-xl border p-10">
        Varo
        <div className="flex flex-col gap-2">
          <SignInButton
            provider="discord"
            label="Discord"
            className="bg-[#5865F2] hover:bg-[#5865F2]/80"
          />
          <SignInButton
            provider="github"
            label="GitHub"
            className="bg-neutral-700 hover:bg-neutral-700/80"
          />
          <SignInButton
            provider="google"
            label="Google"
            className="bg-[#DB4437] hover:bg-[#DB4437]/80"
          />
        </div>
      </div>
    </div>
  );
}

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: "discord" | "google" | "github";
  label: string;
}

function SignInButton({ provider, label, className, ...props }: SignInButtonProps) {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
      type="button"
      size="lg"
      className={cn("text-white hover:text-white", className)}
      {...props}
    >
      Sign in with {label}
    </Button>
  );
}
