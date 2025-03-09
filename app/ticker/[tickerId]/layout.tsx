import { TickerDataType } from "@/app/(main)/page";
import Chart from "@/components/custom/Chart";
import { getSheetData } from "@/services/google-sheet";
import { getTickerById } from "@/services/ticker";
import React from "react";

export default async function Layout({
  children,
  comment,
  params,
}: {
  children: React.ReactNode;
  comment: React.ReactNode;
  params: Promise<{ tickerId: number }>;
}) {
  const { tickerId } = await params;
  const ticker = await getTickerById(Number(tickerId));
  const { data, success } = await getSheetData(ticker?.ticker);

  // console.log(ticker, "CHECK");

  if (!success || !data || !ticker) return null;

  const tickerDetails: TickerDataType = {
    likes: ticker?.tickerLikes?.length || 0,
    likeArray: ticker.tickerLikes || [],
    dislikes: ticker?.tickerDislikes?.length || 0,
    shares: ticker?.shares || 0,
    comments: ticker?.comments?.length || 0,
    commentArray: ticker?.comments || [],
    createdAt: ticker?.createdAt?.toISOString() || "",
    updatedAt: ticker?.updatedAt?.toISOString() || "",
    id: ticker.id,
    ...data[0],
  };
  return (
    <main className="md:w-[60vw] h-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4">
      <Chart data={tickerDetails} oneDisplay />
      {comment}
    </main>
  );
}
