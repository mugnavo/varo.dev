import { X } from "lucide-react";
import { useMemo } from "react";
import { SearchDevelopersReturnType } from "~/server/ai/tools";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface DevProfileCardProps {
  readonly dev: SearchDevelopersReturnType["developers"][0];
}

export default function DevProfileCard({ dev }: DevProfileCardProps) {
  const description = useMemo(() => {
    const text = dev.user_ideaOrProject || dev.user_bio || "";
    return text.length > 60 ? text.slice(0, 60) + "..." : text;
  }, [dev.user_ideaOrProject, dev.user_bio]);

  return (
    <div className="group flex flex-col gap-1.5 rounded-lg border bg-secondary p-3">
      <Avatar className="rounded-sm">
        <AvatarImage src={dev.user_avatar || undefined} />
      </Avatar>
      <div className="text-sm font-medium">{dev.user_name}</div>
      <p className="text-sm">{description}</p>
      <div className="mt-1 flex opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
