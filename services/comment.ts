import prisma from "@/lib/prisma";
import {
  CommentDislike,
  CommentLike,
  Prisma,
  Comment as PrismaComment,
} from "@prisma/client";

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: { user: true };
}>;

export type CommentWithRepliesAndLikesAndUser = Prisma.CommentGetPayload<{
  include: { replies: true; commentLikes: true; user: true };
}>;

export async function createComment(data: {
  content: string;
  tickerId: number;
  userId?: string;
  parentId?: number;
}): Promise<CommentWithRepliesAndLikesAndUser> {
  return await prisma.comment.create({
    data: {
      content: data.content,
      ticker: { connect: { id: data.tickerId } },
      user: data.userId ? { connect: { id: data.userId } } : undefined,
      parent: data.parentId ? { connect: { id: data.parentId } } : undefined,
    },
    include: {
      replies: true,
      commentLikes: true,
      user: true,
    },
  });
}

export async function getCommentById(
  id: number
): Promise<CommentWithRepliesAndLikesAndUser | null> {
  return await prisma.comment.findUnique({
    where: { id },
    include: {
      replies: true,
      commentLikes: true,
      user: true,
    },
  });
}

export async function updateComment(
  id: number,
  data: Partial<{ content: string }>
): Promise<PrismaComment> {
  return await prisma.comment.update({
    where: { id },
    data,
  });
}

export async function deleteComment(id: number): Promise<PrismaComment> {
  return await prisma.comment.delete({
    where: { id },
  });
}

export async function likeComment(
  commentId: number,
  userId: string
): Promise<CommentLike> {
  return await prisma.commentLike.create({
    data: {
      comment: { connect: { id: commentId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function dislikeComment(
  commentId: number,
  userId: string
): Promise<CommentDislike> {
  return await prisma.commentDislike.create({
    data: {
      comment: { connect: { id: commentId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function removeCommentLike(
  commentId: number,
  userId: string
): Promise<CommentLike> {
  return await prisma.commentLike.delete({
    where: { commentId_userId: { commentId, userId } },
  });
}

export async function removeCommentDislike(
  commentId: number,
  userId: string
): Promise<CommentDislike> {
  return await prisma.commentDislike.delete({
    where: { commentId_userId: { commentId, userId } },
  });
}
