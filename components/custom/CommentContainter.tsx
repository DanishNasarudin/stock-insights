"use client";
import { useCommentStore } from "@/lib/zustand";
import { CommentWithRepliesAndLikesAndUser } from "@/services/comment";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import CommentForm from "./CommentForm";
import Comments from "./Comments";

type Props = {
  form: {
    tickerId: number;
    parentId?: number;
  };
  comments?: {
    disableScroll?: boolean;
    comments?: CommentWithRepliesAndLikesAndUser[];
    currentComment?: number;
  };
};

export default function CommentContainter({ form, comments }: Props) {
  const zusComments = useCommentStore(useShallow((state) => state.comments));
  const initComment = useCommentStore(useShallow((state) => state.initComment));

  useEffect(() => {
    if (comments?.comments) initComment(comments?.comments);
  }, [comments?.comments]);

  const commentsMemo = useMemo(() => {
    if (zusComments.length > 0) return zusComments;
    return comments?.comments;
  }, [comments?.comments, zusComments]);

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <CommentForm {...form} />
      <Comments {...comments} comments={commentsMemo} />
    </div>
  );
}
