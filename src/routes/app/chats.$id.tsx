export const Route = createFileRoute({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /app/chats/$id!";
}
