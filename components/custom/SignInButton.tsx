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
        <TooltipWrapper content="SignIn">
          <ClerkSignIn>
            <Button variant={"outline"} size={"icon"}>
              <LogInIcon />
            </Button>
          </ClerkSignIn>
        </TooltipWrapper>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
