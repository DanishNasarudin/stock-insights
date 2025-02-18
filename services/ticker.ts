import prisma from "@/lib/prisma";
import { Ticker, TickerDislike, TickerLike } from "@prisma/client";

export async function createTicker(data: {
  ticker: string;
  shares?: number;
}): Promise<Ticker> {
  return await prisma.ticker.create({
    data: {
      ticker: data.ticker,
      shares: data.shares ?? 0,
    },
  });
}

export async function getTickerById(id: number): Promise<Ticker | null> {
  return await prisma.ticker.findUnique({
    where: { id },
    include: {
      comments: true,
      tickerLikes: true,
      tickerDislikes: true,
    },
  });
}

export async function updateTicker(
  id: number,
  data: Partial<{ ticker: string; shares: number }>
): Promise<Ticker> {
  return await prisma.ticker.update({
    where: { id },
    data,
  });
}

export async function deleteTicker(id: number): Promise<Ticker> {
  return await prisma.ticker.delete({
    where: { id },
  });
}

export async function likeTicker(
  tickerId: number,
  userId: string
): Promise<TickerLike> {
  return await prisma.tickerLike.create({
    data: {
      ticker: { connect: { id: tickerId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function dislikeTicker(
  tickerId: number,
  userId: string
): Promise<TickerDislike> {
  return await prisma.tickerDislike.create({
    data: {
      ticker: { connect: { id: tickerId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function removeTickerLike(
  tickerId: number,
  userId: string
): Promise<TickerLike> {
  return await prisma.tickerLike.delete({
    where: { tickerId_userId: { tickerId, userId } },
  });
}

export async function removeTickerDislike(
  tickerId: number,
  userId: string
): Promise<TickerDislike> {
  return await prisma.tickerDislike.delete({
    where: { tickerId_userId: { tickerId, userId } },
  });
}
