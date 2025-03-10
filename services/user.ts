"use server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

export async function createUser(data: {
  id: string;
  name: string;
  avatarSrc: string;
}): Promise<User> {
  return await prisma.user.create({
    data,
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      comments: true,
      tickerLikes: true,
      tickerDislikes: true,
      commentLikes: true,
      commentDislikes: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: Partial<{ name: string; avatarSrc: string }>
): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string): Promise<User> {
  return await prisma.user.delete({
    where: { id },
  });
}

export async function isUserExist(userId: string) {
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
}
