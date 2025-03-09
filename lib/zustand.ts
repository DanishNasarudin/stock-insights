import { addComment } from "@/services/action";
import { CommentWithRepliesAndLikesAndUser } from "@/services/comment";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";

type CommentStore = {
  comments: CommentWithRepliesAndLikesAndUser[];
  initComment: (comments: CommentWithRepliesAndLikesAndUser[]) => void;
  createComment: (data: {
    content: string;
    pathname: string;
    tickerId: number;
    parentId?: number;
    userId?: string;
  }) => void;
};

export const useCommentStore = create<CommentStore>()((set, get) => ({
  comments: [],
  initComment: (comments) =>
    set({
      comments,
    }),
  createComment: async ({ content, tickerId, userId, parentId, pathname }) => {
    const currentComments = get().comments;

    const newComments: CommentWithRepliesAndLikesAndUser[] = [
      {
        id: -1,
        content,
        likes: 0,
        dislikes: 0,
        userId: userId || null,
        tickerId,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {} as User,
        commentLikes: [],
        replies: [],
      },
      ...currentComments,
    ];

    set({ comments: newComments });

    try {
      const response = await addComment({
        content,
        tickerId,
        pathname,
        parentId,
        userId,
      });
      set({
        comments: [
          { ...response, user: {} as User, commentLikes: [], replies: [] },
          ...currentComments,
        ],
      });
    } catch (error: any) {
      toast.error(`Failed to add comment, Error: ${error.message}`);
      set({ comments: currentComments });
    }
  },
}));
