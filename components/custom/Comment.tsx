"use client";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { memo, SetStateAction } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { CommentNode } from "./Comments";

type PureComment = {
  data: CommentNode;
  hasChildren?: boolean;
  depth?: number;
  expanded?: boolean;
  setExpanded?: (newValue: SetStateAction<boolean>) => void;
  length?: number;
};

function PureComment({
  data,
  hasChildren = false,
  depth = -1,
  expanded = false,
  setExpanded = () => {},
  length = -1,
}: PureComment) {
  const time = timeAgo(data.updatedAt);

  function numberOfLikes() {
    return data.likes > 0 && <span>{data.likes}</span>;
  }
  function numberOfComments() {
    return data.children.length > 0 && <span>{data.children.length}</span>;
  }

  return (
    <div className="flex gap-2 py-2">
      <div className="flex flex-col items-center">
        <Avatar>
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
        {/* {data.isParent && (
          <div className="py-2 h-full">
            <Separator orientation="vertical" className="" />
          </div>
        )} */}
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex gap-2">
          <p className="font-bold leading-none">{data.userId}</p>
          <p className="leading-none text-muted-foreground/50">{time}</p>
        </div>
        <p>{data.content}</p>
        <div className="flex gap-4">
          <Button variant={"ghost"} size={"icon"} className="gap-1">
            <HeartIcon />
            {numberOfLikes()}
          </Button>
          <Button variant={"ghost"} size={"icon"} className="gap-1">
            <MessageCircleIcon />
            {numberOfComments()}
          </Button>
        </div>
        {hasChildren && depth < 2 && (
          <Button
            variant={"link"}
            size={"sm"}
            onClick={() => setExpanded((prev) => !prev)}
            className="text-sm text-blue-500 w-full justify-start px-0 h-4"
          >
            {expanded ? "Hide replies" : `Show replies (${length})`}
          </Button>
        )}
        {hasChildren && depth === 2 && (
          <Link href={`/ticker/${data.tickerId}`}>
            <Button
              variant={"link"}
              size={"sm"}
              className="text-sm text-blue-500 w-full justify-start px-0 h-4"
            >
              Show more replies
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export const Comment = memo(PureComment);

const timeAgo = (updatedAt: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - updatedAt.getTime()) / 1000
  );

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y`;
  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};
