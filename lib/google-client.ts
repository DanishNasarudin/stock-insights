import { google } from "googleapis";
export const googleAuth = await google.auth.getClient({
  projectId: process.env.PROJECT_ID!,
  credentials: {
    type: "service_account",
    projectId: process.env.PROJECT_ID!,
    private_key_id: process.env.PRIVATE_KEY_ID!,
    private_key: process.env.PRIVATE_KEY!,
    client_email: process.env.CLIENT_EMAIL!,
    universe_domain: "googleapis.com",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
