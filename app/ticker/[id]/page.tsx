import { getTickerByName } from "@/services/ticker";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TickerPage({ params }: Props) {
  const { id } = await params;

  const ticker = await getTickerByName(id);

  console.log(ticker, "CHECK");

  return <div>Page Ticker: {id}</div>;
}
