"use server";

import { googleAuth } from "@/lib/google-client";
import { handleTryCatchError } from "@/lib/utils";
import { ResponseType } from "@/types/response";
import { google } from "googleapis";

type SheetData = [string, string | number][];

type GetSheetDataResponse = ResponseType & {
  data?: SheetData;
};

export async function getSheetData(): Promise<GetSheetDataResponse> {
  try {
    const googleSheets = google.sheets({ version: "v4", auth: googleAuth });

    const data = await googleSheets.spreadsheets.values.get({
      spreadsheetId: "1PQ7ZDnKKtXKuIRQo-NrZlyvsMxxA7fq-6Od9UOkGruU",
      range: "A1:B28",
    });

    const finalData = data.data.values as SheetData;

    return { success: true, data: finalData };
  } catch (error) {
    return handleTryCatchError(error, "@getSheetData");
  }
}
