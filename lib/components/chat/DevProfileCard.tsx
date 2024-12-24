import { X } from "lucide-react";
import { useMemo } from "react";
import { User } from "~/lib/server/db/schema";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface DevProfileCardProps {
  readonly dev: Pick<
    User,
    "id" | "name" | "avatar_url" | "bio" | "ideaOrProject" | "username"
  >;
}

export default function DevProfileCard({ dev }: DevProfileCardProps) {
  const description = useMemo(() => {
    const text = dev.ideaOrProject || dev.bio || "";
    return text.length > 64 ? text.slice(0, 64) + "..." : text;
  }, [dev.ideaOrProject, dev.bio]);

  return (
    <div className="group flex flex-col gap-1.5 rounded-lg border bg-secondary p-3">
      <Avatar className="rounded-sm">
        <AvatarImage src={dev.avatar_url || undefined} />
      </Avatar>
      <div className="text-sm font-medium">{dev.name || dev.username}</div>
      <p className="text-sm">{description}</p>
      <div className="mt-1 flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button size="sm" className="h-7 w-full rounded-r-none text-xs">
          Connect
        </Button>
        <Button
          size="icon"
          className="h-7 rounded-l-none bg-background"
          variant="secondary"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
