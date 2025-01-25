"use server";

import { googleAuth } from "@/lib/google-client";
import { handleTryCatchError } from "@/lib/utils";
import { ResponseType } from "@/types/response";
import { google } from "googleapis";

type SheetData = [string, string | number][];

type DividendDataType = {
  year: string;
  dividend: number;
};

type GetSheetDataResponse = ResponseType & {
  data?: {
    values: DividendDataType[];
    label: string;
  };
};

export async function getSheetData(): Promise<GetSheetDataResponse> {
  try {
    const googleSheets = google.sheets({ version: "v4", auth: googleAuth });

    const data = await googleSheets.spreadsheets.values.get({
      spreadsheetId: "1PQ7ZDnKKtXKuIRQo-NrZlyvsMxxA7fq-6Od9UOkGruU",
      range: "A1:B28",
    });

    const dataValues = data.data.values as SheetData;

    const processData =
      dataValues &&
      dataValues.slice(1).map(([year, dividend]) => {
        return {
          year: year as string,
          dividend: parseFloat(dividend as string),
        };
      });

    const sheetLabel = data.data.range?.split("!")[0];

    return {
      success: true,
      data: { values: processData, label: sheetLabel || "Undefined" },
    };
  } catch (error) {
    return handleTryCatchError(error, "@getSheetData");
  }
}
