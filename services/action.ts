"use server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  CommentWithRepliesAndLikesAndUser,
  createComment,
  getCommentById,
} from "./comment";
import { createNotification } from "./notification";
import { createUser } from "./user";

export async function addComment({
  content,
  tickerId,
  pathname,
  parentId,
  userId,
}: {
  content: string;
  tickerId: number;
  pathname: string;
  parentId?: number;
  userId?: string;
}): Promise<CommentWithRepliesAndLikesAndUser> {
  try {
    const userExist = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExist) {
      if (!userId) {
        throw new Error("User data input incomplete, unable to create User.");
      }
      const clerk = await clerkClient();

      const userClerk = await clerk.users.getUser(userId);

      await createUser({
        id: userId,
        name: userClerk.fullName || "",
        avatarSrc: userClerk.imageUrl,
      });
    }

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

    revalidatePath(pathname);

    return response;
  } catch (error: any) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
}
