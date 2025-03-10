"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { SocketProvider } from "./socket-provider";
import { ThemeProvider } from "./theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          footer: "hidden",
        },
        signIn: {
          variables: {
            colorBackground: "transparent",
          },
          elements: {
            cardBox: {
              boxShadow: "none",
            },
          },
        },
      }}
    >
      <SocketProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </SocketProvider>
    </ClerkProvider>
  );
};

export default Providers;
