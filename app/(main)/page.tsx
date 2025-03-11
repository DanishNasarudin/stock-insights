import Chart from "@/components/custom/Chart";
import Inputs from "@/components/custom/Inputs";
import Loading from "@/components/custom/Loading";
import Placeholder from "@/components/custom/Placeholder";
import { formatDateTime } from "@/lib/utils";
import { CommentWithRepliesAndLikesAndUser } from "@/services/comment";
import {
  DividendDataType,
  SheetDataType,
  syncGoogleSheetTickers,
} from "@/services/google-sheet";
import { createTicker, getTickerByName } from "@/services/ticker";
import { TickerLike } from "@prisma/client";
import { TriangleAlertIcon } from "lucide-react";
import { Suspense } from "react";

// export const revalidate = 120;
// export const dynamic = "force-static";
// export const dynamicParams = true;

/**
 * Attributes:
 * {values, label, valueName, valueType, likes, dislikes, shares, createdAt, updatedAt}
 */
export type TickerDataType = SheetDataType & {
  likes: number;
  likeArray: TickerLike[];
  dislikes: number;
  shares: number;
  comments: number;
  commentArray: CommentWithRepliesAndLikesAndUser[];
  createdAt: string;
  updatedAt: string;
  id: number;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { search } = await searchParams;
  const { data, success, updatedAt } = await syncGoogleSheetTickers();

  const searchTerm = Array.isArray(search) ? search[0] : search;

  // console.log("@First Query: ", data && data[1]);

  if (!success)
    return (
      <Placeholder
        icon={TriangleAlertIcon}
        iconClassName="stroke-red-500"
        title="Data Unavailable!"
        subtitle="Please try again later."
      />
    );

  const filterData = searchTerm
    ? data
      ? data.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : data
    : data;

  // console.log(await searchParams, search, searchTerm, "CHECK");

  const tickerDetails: Promise<TickerDataType[]> | undefined = filterData
    ? Promise.all(
        filterData.map(async (item): Promise<TickerDataType> => {
          const dataTicker = await getTickerByName(item.label);
          if (!dataTicker) {
            const newTicker = await createTicker({ ticker: item.label });

            return {
              ...item,
              likes: 0,
              likeArray: [],
              dislikes: 0,
              shares: 0,
              comments: 0,
              commentArray: [],
              createdAt: "",
              updatedAt: "",
              id: newTicker.id,
            };
          }

          return {
            ...item,
            likes: dataTicker.tickerLikes.length,
            likeArray: dataTicker.tickerLikes,
            dislikes: dataTicker.tickerDislikes.length,
            shares: dataTicker.shares,
            comments: dataTicker.comments.length,
            commentArray: dataTicker.comments,
            createdAt: dataTicker.createdAt.toISOString(),
            updatedAt: dataTicker.updatedAt.toISOString(),
            id: dataTicker.id,
          };
        })
      )
    : undefined;

  const groupedCharts = tickerDetails
    ? (await tickerDetails).reduce(
        (
          acc: {
            values: DividendDataType[];
            label: string;
            valueName: string;
            valueType: string;
            likes: number;
            likeArray: TickerLike[];
            dislikes: number;
            shares: number;
            comments: number;
            commentArray: CommentWithRepliesAndLikesAndUser[];
            createdAt: string;
            updatedAt: string;
            id: number;
          }[][],
          item,
          index
        ) => {
          if (index % 2 === 0) acc.push([]);
          acc[acc.length - 1].push(item);
          return acc;
        },
        []
      )
    : [];

  return (
    <div className="flex flex-col gap-4 p-4 w-full md:max-w-[80vw] mx-auto h-full">
      <div className="py-4 space-y-2">
        <span className="text-lg font-bold">
          Malaysia's Stock Dividend Tracker
        </span>
        <Inputs />
        <p className="text-xs text-secondary-foreground/60">
          Data last updated: {formatDateTime(updatedAt!)}
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        {groupedCharts.length > 0 ? (
          groupedCharts.map((row, rowIndex) => (
            <div key={rowIndex} className="flex sm:flex-row flex-col gap-4">
              {row.map((item, chartIndex) => (
                <Chart key={`${rowIndex}-${chartIndex}`} data={item} />
              ))}
            </div>
          ))
        ) : (
          <Placeholder
            icon={TriangleAlertIcon}
            iconClassName="stroke-red-500"
            title="Stock does not exist OR not in database!"
            subtitle="Contact our support here: example@easydivmy.com"
          />
        )}
      </Suspense>
    </div>
  );
}
