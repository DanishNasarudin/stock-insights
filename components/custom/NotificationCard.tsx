"use client";
import { timeAgo } from "@/lib/utils";
import { setNotificationRead } from "@/services/notification";
import { Comment } from "@prisma/client";
import { DotIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type Props = {
  id?: number;
  userName?: string;
  userImage?: string;
  timestamp?: Date;
  isRead?: boolean;
  comment?: Comment;
};

export default function NotificationCard({
  id = -1,
  userName = "Undefined",
  userImage = "/",
  timestamp = new Date(),
  isRead = false,
  comment = {} as Comment,
}: Props) {
  const time = timeAgo(timestamp);
  const pathname = usePathname();

  const [optimisticIsRead, setOptimisticIsRead] = useOptimistic(
    isRead,
    (_, newIsRead: boolean) => newIsRead
  );

  const [_, startTransition] = useTransition();

  const setIsRead = async (isReadNew: boolean) => {
    if (isReadNew !== isRead) {
      startTransition(() => {
        setOptimisticIsRead(!optimisticIsRead);
      });
      await setNotificationRead({ id, isRead: isReadNew, pathname });
    }
  };

  const initials = userName
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");
  return (
    <div className="w-full flex justify-between gap-2 bg-primary-foreground p-4 rounded-lg">
      <div>
        <Avatar>
          <AvatarImage src={userImage || undefined}></AvatarImage>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex gap-2">
          <p className="font-bold leading-none">{userName}</p>
          <p className="leading-none text-muted-foreground/50">{time}</p>
        </div>
        <p>{comment.content}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant={"outline"}
          className="relative"
          onClick={() => setIsRead(!optimisticIsRead)}
        >
          {optimisticIsRead ? "Mark as Unread" : "Mark as Read"}
          {!optimisticIsRead && (
            <DotIcon className="absolute !h-20 !w-20 top-0 right-0 translate-x-[50%] translate-y-[-50%] stroke-red-500 fill-red-500" />
          )}
        </Button>
        <Link href={`/ticker/${comment.tickerId}/comment/${comment.id}`}>
          <Button
            variant={"outline"}
            onClick={() => setIsRead(true)}
            className="w-full"
          >
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}
