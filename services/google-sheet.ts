"use server";

import { googleAuth } from "@/lib/google-client";
import { handleTryCatchError } from "@/lib/utils";
import { google } from "googleapis";

type SheetData = [string, string | number][];

export type ResponseType = {
  success: boolean;
  error?: string;
};

export type DividendDataType = {
  year: string | null;
  dividend: number | null;
};

type GetSheetDataResponse = ResponseType & {
  data?: {
    values: DividendDataType[];
    label: string;
    valueName: string;
    valueType: string;
  }[];
  updatedAt?: string;
};

/**
 * Getting all available data from google sheet
 * @returns data: { values, label }, updatedAt
 */
export async function getSheetData(): Promise<GetSheetDataResponse> {
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
      .sort((a, b) => a.label.localeCompare(b.label));

    return {
      success: true,
      data: data,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return handleTryCatchError(error, "@getSheetData");
  }
}
