import Comments from "@/components/custom/Comments";
import { getTickerById } from "@/services/ticker";

type Props = {
  params: Promise<{ commentId: number; tickerId: number }>;
};

export default async function Page({ params }: Props) {
  const { commentId, tickerId } = await params;

  const ticker = await getTickerById(Number(tickerId));

  if (!ticker) return null;

  return (
    <Comments
      disableScroll
      comments={ticker.comments}
      currentComment={Number(commentId)}
    />
  );
}
