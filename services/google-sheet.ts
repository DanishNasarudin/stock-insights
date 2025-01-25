"use server";

import { googleAuth } from "@/lib/google-client";
import { handleTryCatchError } from "@/lib/utils";
import { ResponseType } from "@/types/response";
import { google } from "googleapis";
import { unstable_cache } from "next/cache";

type SheetData = [string, string | number][];

export type DividendDataType = {
  year: string | null;
  dividend: number | null;
};

type GetSheetDataResponse = ResponseType & {
  data?: {
    values: DividendDataType[];
    label: string;
  }[];
  updatedAt?: string;
};

export const getSheetData = unstable_cache(
  async (): Promise<GetSheetDataResponse> => {
    try {
      const googleSheets = google.sheets({ version: "v4", auth: googleAuth });

      const response = await googleSheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEET_URL,
        includeGridData: true,
      });

      const data = response.data.sheets?.flatMap((sheet) => {
        const label = sheet.properties?.title || "Unknown Sheet";
        const rows = sheet.data?.[0]?.rowData || [];

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

        return { label, values };
      });

      return {
        success: true,
        data: data,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return handleTryCatchError(error, "@getSheetData");
    }
  },
  ["data"],
  {
    tags: ["data"],
    revalidate: 120,
  }
);
