import { SearchDevelopersReturnType } from "~/server/ai/tools";

interface DevProfileCardProps {
  readonly dev: SearchDevelopersReturnType["developers"][0];
}

export default function DevProfileCard({ dev }: DevProfileCardProps) {
  return <div className="rounded-lg border bg-secondary p-2">{dev.user_name}</div>;
}
