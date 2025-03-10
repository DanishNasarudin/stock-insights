import { addComment } from "@/services/action";
import { CommentWithRepliesAndLikesAndUser } from "@/services/comment";
import { User } from "@clerk/nextjs/server";
import { toast } from "sonner";
import { create } from "zustand";

type CommentStore = {
  comments: CommentWithRepliesAndLikesAndUser[];
  initComment: (comments: CommentWithRepliesAndLikesAndUser[]) => void;
  createComment: (data: {
    content: string;
    pathname: string | null;
    tickerId: number;
    parentId?: number;
    user: User;
  }) => void;
  commentUpdateStatus: "latest" | "updating" | "success";
};

export const useCommentStore = create<CommentStore>()((set, get) => ({
  comments: [],
  initComment: (comments) =>
    set({
      comments,
      commentUpdateStatus: "latest",
    }),
  createComment: async ({ content, tickerId, user, parentId, pathname }) => {
    const currentComments = get().comments;

    const newComments: CommentWithRepliesAndLikesAndUser[] = [
      {
        id: -1,
        content,
        likes: 0,
        dislikes: 0,
        userId: user.id || null,
        tickerId,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          name: user.fullName || "Guest",
          id: user.id,
          avatarSrc: user.imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        commentLikes: [],
        replies: [],
      },
      ...currentComments,
    ];

    set({ comments: newComments, commentUpdateStatus: "updating" });

    try {
      const response = await addComment({
        content,
        tickerId,
        pathname,
        parentId,
        userId: user.id,
      });
      set({
        comments: [{ ...response }, ...currentComments],
        commentUpdateStatus: "success",
      });
    } catch (error: any) {
      toast.error(`Failed to add comment, Error: ${error.message}`);
      set({ comments: currentComments });
    }
  },
  commentUpdateStatus: "latest",
}));
