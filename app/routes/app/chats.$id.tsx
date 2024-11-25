import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chats/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /app/chats/$id!";
}
