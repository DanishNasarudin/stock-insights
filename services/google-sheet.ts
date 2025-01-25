"use server";

import { googleAuth } from "@/lib/google-client";
import { handleTryCatchError } from "@/lib/utils";
import { ResponseType } from "@/types/response";
import { google } from "googleapis";

type GetSheetDataResponse = ResponseType & {
  data?: any;
};

export async function getSheetData(): Promise<GetSheetDataResponse> {
  try {
    const googleSheets = google.sheets({ version: "v4", auth: googleAuth });

    const data = await googleSheets.spreadsheets.values.get({
      spreadsheetId: "1PQ7ZDnKKtXKuIRQo-NrZlyvsMxxA7fq-6Od9UOkGruU",
      range: "A1:B28",
    });

    return { success: true, data: data.data.values };
  } catch (error) {
    return handleTryCatchError(error, "@getSheetData");
  }
}
