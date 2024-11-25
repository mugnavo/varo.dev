import { SearchDevelopersReturnType } from "~/server/ai/tools";
import { Avatar, AvatarImage } from "../ui/avatar";

interface DevProfileCardProps {
  readonly dev: SearchDevelopersReturnType["developers"][0];
}

export default function DevProfileCard({ dev }: DevProfileCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-secondary p-2">
      <Avatar className="rounded-sm">
        <AvatarImage src={dev.user_avatar || undefined} />
      </Avatar>
      {dev.user_name}
    </div>
  );
}
