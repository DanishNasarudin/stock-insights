"use server";
import prisma from "@/lib/prisma";
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
