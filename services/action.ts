"use server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { Comment } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createComment } from "./comment";
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
}): Promise<Comment> {
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

    revalidatePath(pathname);

    return response;
  } catch (error: any) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
}
