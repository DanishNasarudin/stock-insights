"use server";
import { revalidatePath } from "next/cache";
import {
  CommentWithRepliesAndLikesAndUser,
  createComment,
  getCommentById,
} from "./comment";
import { createNotification } from "./notification";
import { isUserExist } from "./user";

export async function addComment({
  content,
  tickerId,
  pathname,
  parentId,
  userId,
}: {
  content: string;
  tickerId: number;
  pathname: string | null;
  parentId?: number;
  userId: string;
}): Promise<CommentWithRepliesAndLikesAndUser> {
  try {
    await isUserExist(userId);

    const response = await createComment({
      content,
      tickerId,
      userId,
      parentId,
    });

    if (parentId && userId) {
      const repliedToUser = await getCommentById(parentId);

      if (repliedToUser?.userId && userId !== repliedToUser.userId) {
        await createNotification({
          userId: repliedToUser.userId,
          type: "comment",
          from: userId,
          commentId: response.id,
        });
      }
    }

    revalidatePath(pathname || "/");

    return response;
  } catch (error: any) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
}
