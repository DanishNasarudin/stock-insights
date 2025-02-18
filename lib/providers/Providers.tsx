"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          footer: "hidden",
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Providers;
