/*
  Warnings:

  - A unique constraint covering the columns `[ticker]` on the table `Ticker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ticker_ticker_key" ON "Ticker"("ticker");
