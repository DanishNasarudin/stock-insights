"use server";

import { googleAuth } from "@/lib/google-client";
import prisma from "@/lib/prisma";
import { handleTryCatchError } from "@/lib/utils";
import { google } from "googleapis";
import { createTicker } from "./ticker";

type SheetData = [string, string | number][];

export type ResponseType = {
  success: boolean;
  error?: string;
};

export type DividendDataType = {
  year: string | null;
  dividend: number | null;
};

export type SheetDataType = {
  values: DividendDataType[];
  label: string;
  valueName: string;
  valueType: string;
};

type GetSheetDataResponse = ResponseType & {
  data?: SheetDataType[];
  updatedAt?: string;
};

/**
 * Getting all available data from google sheet
 * @returns data: { values, label }, updatedAt
 */
export async function getSheetData(
  filter: string = ""
): Promise<GetSheetDataResponse> {
  try {
    const googleSheets = google.sheets({ version: "v4", auth: googleAuth });

    const response = await googleSheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_URL,
      includeGridData: true,
    });

    const data = response.data.sheets
      ?.flatMap((sheet) => {
        const label = sheet.properties?.title || "Unknown Sheet";
        const rows = sheet.data?.[0]?.rowData || [];

        const check = rows[0].values?.[1].formattedValue?.split(" ");

        const valueName = check?.[0] || "Undefined";
        const valueType = check?.[1] || "%";

        // console.log(check, "@GET SHEET");

        const values = rows
          .slice(1)
          .filter((row) => row.values?.[0]?.formattedValue)
          .map((row) => {
            return {
              year: row.values?.[0]?.formattedValue || null,
              dividend:
                parseFloat(row.values?.[1]?.formattedValue as string) || null,
            };
          });

        return { label, values, valueName, valueType };
      })
      .sort((a, b) => a.label.localeCompare(b.label))
      .filter((ticker) => (filter !== "" ? ticker.label === filter : ticker));

    return {
      success: true,
      data: data,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return handleTryCatchError(error, "@getSheetData");
  }
}

export async function syncGoogleSheetTickers(): Promise<{
  created: number;
  existing: number;
}> {
  const { data, success } = await getSheetData();

  if (!success || !data) {
    throw new Error("Failed to retrieve Google Sheet data");
  }

  // Get existing ticker labels from the database (case-insensitive)
  const existingTickers = await prisma.ticker.findMany({
    select: { ticker: true },
  });
  const existingTickerSet = new Set(
    existingTickers.map((ticker) => ticker.ticker)
  );

  let created = 0;
  let existing = 0;

  // Iterate over each ticker from the Google Sheet data
  for (const sheetTicker of data) {
    const tickerLabel = sheetTicker.label;
    // const ticker = tickerLabel.toLowerCase().replace(/[\s_]+/g, "-");
    if (!existingTickerSet.has(tickerLabel)) {
      await createTicker({ ticker: tickerLabel });
      created++;
    } else {
      existing++;
    }
  }

  return { created, existing };
}
