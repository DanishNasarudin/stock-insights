import { addComment } from "@/services/action";
import { Comment } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";

type CommentStore = {
  comments: Comment[];
  initComment: (comments: Comment[]) => void;
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

    const newComments: Comment[] = [
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
      set({ comments: [response, ...currentComments] });
    } catch (error: any) {
      toast.error(`Failed to add comment, Error: ${error.message}`);
      set({ comments: currentComments });
    }
  },
}));
