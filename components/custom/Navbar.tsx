import icon from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import SignInButton from "./SignInButton";
import ThemeButton from "./ThemeButton";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gradient-to-r from-blue-950 to-blue-900 border-b-border border-b-[1px] flex justify-between items-center">
      <Link href={"/"}>
        <Button variant={"ghost"} className="hover:bg-transparent p-0">
          <Image
            src={icon.src}
            width={icon.width}
            height={icon.height}
            alt="EasyDivMy Logo"
            className="w-8"
          />
          <span className="text-lg font-black text-white">EasyDivMy</span>
        </Button>
      </Link>
      <div className="flex align-middle gap-4">
        <SignInButton />
        <ThemeButton />
      </div>
    </nav>
  );
}
