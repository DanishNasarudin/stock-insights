"use client";
import {
  SignInButton as ClerkSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
import { Button } from "../ui/button";
import TooltipWrapper from "./TooltipWrapper";

export default function SignInButton() {
  return (
    <>
      <SignedOut>
        <ClerkSignIn>
          <TooltipWrapper content="SignIn">
            <Button variant={"outline"} size={"icon"}>
              <LogInIcon />
            </Button>
          </TooltipWrapper>
        </ClerkSignIn>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
