"use client";
import { cn, timeAgo } from "@/lib/utils";
import { likeComment, removeCommentLike } from "@/services/comment";
import { useClerk } from "@clerk/nextjs";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import CommentForm from "./CommentForm";
import { CommentNode } from "./Comments";
import LoginDialog from "./LoginDialog";

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
  const user = useClerk();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    data.likes,
    (_, newLikes: number) => newLikes
  );

  const userLikedComment = useMemo(
    () =>
      data.commentLikes.some(
        (comment) =>
          comment.commentId === data.id &&
          comment.userId === user.session?.user.id
      ),
    [user.session?.user.id, data.commentLikes, data.id]
  );

  const [optimisticUserLiked, setOptimisticUserLiked] = useOptimistic(
    userLikedComment,
    (_, newLike: boolean) => newLike
  );

  const [_, startTransition] = useTransition();

  const handleLikeComment = async () => {
    if (!user.session?.user.id) {
      setOpen(true);
      return;
    }

    if (optimisticUserLiked) {
      startTransition(() => {
        setOptimisticLikes(optimisticLikes - 1);
        setOptimisticUserLiked(false);
      });
      await removeCommentLike(data.id, user.session?.user.id, pathname);
    } else {
      startTransition(() => {
        setOptimisticLikes(optimisticLikes + 1);
        setOptimisticUserLiked(true);
      });
      await likeComment(data.id, user.session?.user.id, pathname);
    }
  };

  // console.log(userLikedComment, "CHECK LIKES");

  function numberOfLikes() {
    return optimisticLikes > 0 && <span>{optimisticLikes}</span>;
  }
  function numberOfComments() {
    return data.children.length > 0 && <span>{data.children.length}</span>;
  }

  const [openComment, setOpenComment] = useState(false);

  useEffect(() => {
    if (openComment) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [openComment]);

  const initials = data.user?.name
    ? data.user?.name
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map((word) => word[0].toUpperCase())
        .join("")
    : "G";

  return (
    <div className="flex gap-2 py-2">
      <div className="flex flex-col items-center">
        <Avatar>
          <AvatarImage src={data.user?.avatarSrc || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex gap-2">
          <p className="font-bold leading-none">{data.user?.name}</p>
          <p className="leading-none text-muted-foreground/50">{time}</p>
        </div>
        <p>{data.content}</p>
        <div className="flex gap-4">
          <Button
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "gap-1 ",
              optimisticUserLiked && "text-red-500 hover:text-red-500"
            )}
            onClick={handleLikeComment}
          >
            <HeartIcon
              className={cn(optimisticUserLiked && "stroke-red-500")}
            />
            {numberOfLikes()}
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="gap-1"
            onClick={() => setOpenComment(!openComment)}
          >
            <MessageCircleIcon />
            {numberOfComments()}
          </Button>
        </div>
        {openComment && (
          <CommentForm
            setOpenComment={setOpenComment}
            tickerId={data.tickerId}
            parentId={data.id}
            className="pb-4 pt-3"
          />
        )}
        {hasChildren && depth < 2 && (
          <Button
            variant={"link"}
            size={"sm"}
            onClick={() => setExpanded((prev) => !prev)}
            className={cn(
              !expanded && "mb-2",
              "text-sm text-blue-500 w-full justify-start px-0 h-4"
            )}
          >
            {expanded ? "Hide replies" : `Show replies (${length})`}
          </Button>
        )}
        {hasChildren && depth === 2 && (
          <Link href={`/ticker/${data.tickerId}/comment/${data.id}`}>
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
      <LoginDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const Comment = memo(PureComment);
