import { getTickerById } from "@/services/ticker";

type Props = {
  params: Promise<{ id: number }>;
};

export default async function TickerPage({ params }: Props) {
  const { id } = await params;

  const ticker = await getTickerById(Number(id));

  console.log(ticker, "CHECK");

  return <div>Page Ticker: {ticker?.ticker}</div>;
}
