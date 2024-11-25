import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/connections/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /app/connections/$id!";
}
