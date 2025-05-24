import { Link, useRouter } from "@tanstack/react-router";
import ThemeToggle from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth/auth-client";

export const Route = createFileRoute({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  const { queryClient } = Route.useRouteContext();
  const { user } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">Varo</h1>

      {user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {user.name}!</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/app">Go to App</Link>
          </Button>
          <div>
            More data:
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>

          <Button
            onClick={async () => {
              await authClient.signOut();
              await queryClient.invalidateQueries({ queryKey: ["user"] });
              await router.invalidate();
            }}
            type="button"
            className="w-fit"
            variant="destructive"
            size="lg"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>You are not signed in.</p>
          <Button type="button" asChild className="w-fit" size="lg">
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>
      )}

      <ThemeToggle />
    </div>
  );
}
