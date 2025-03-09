"use server";

import prisma from "@/lib/prisma";
import { Notification, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createNotification({
  userId,
  type,
  from,
  commentId,
}: {
  userId: string;
  type: "comment" | "ticker";
  from: string;
  commentId?: number;
}): Promise<Notification> {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      from,
      isRead: false,
      commentId,
    },
  });
}

export type NotificationWithFromUser = Prisma.NotificationGetPayload<{
  include: { fromUser: true; comment: true };
}>;

export async function getNotificationByUser({
  userId,
}: {
  userId: string;
}): Promise<NotificationWithFromUser[]> {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
    include: {
      fromUser: true,
      comment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function setNotificationRead({
  id,
  isRead,
  pathname,
}: {
  id: number;
  isRead: boolean;
  pathname: string;
}): Promise<Notification> {
  const response = await prisma.notification.update({
    where: {
      id,
    },
    data: {
      isRead,
    },
  });

  revalidatePath(pathname);

  return response;
}

export async function getNotificationUnreadByUser({
  userId,
}: {
  userId: string;
}): Promise<number> {
  const response = await prisma.notification.findMany({
    where: {
      userId,
    },
  });
  let unreadNotifications: number = 0;
  response.forEach((res) => {
    if (!res.isRead) {
      unreadNotifications++;
    }
  });

  return unreadNotifications;
}
