import { X } from "lucide-react";
import { useMemo } from "react";
import { type User } from "~/lib/server/schema";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface DevProfileCardProps {
  readonly dev: Pick<
    User,
    "id" | "name" | "image" | "bio" | "idea_or_project" | "username"
  >;
}

export default function DevProfileCard({ dev }: DevProfileCardProps) {
  const description = useMemo(() => {
    const text = dev.idea_or_project || dev.bio || "";
    return text.length > 64 ? text.slice(0, 64) + "..." : text;
  }, [dev.idea_or_project, dev.bio]);

  return (
    <div className="group flex flex-col gap-1.5 rounded-lg border bg-secondary p-3">
      <Avatar className="rounded-sm">
        <AvatarImage src={dev.image || undefined} />
      </Avatar>
      <div className="text-sm font-medium">{dev.name || dev.username}</div>
      <p className="text-sm">{description}</p>
      <div className="mt-1 flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button size="sm" className="h-7 flex-1 rounded-r-none text-xs">
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
