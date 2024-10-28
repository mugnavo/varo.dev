import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: DashboardIndex,
});

export default function DashboardIndex() {
  return <div className="flex flex-col gap-1">Dashboard index page</div>;
}
