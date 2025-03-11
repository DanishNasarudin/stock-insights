import icon from "@/public/logo.png";
import { getNotificationUnreadByUserCached } from "@/services/notification";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NotificationButton from "./NotificationButton";
import SignInButton from "./SignInButton";
import ThemeButton from "./ThemeButton";

export default async function Navbar({ userId }: { userId?: string | null }) {
  let notifications: number = 0;

  if (userId) {
    notifications = await getNotificationUnreadByUserCached({ userId });
  }

  return (
    <nav className="p-4 bg-gradient-to-r from-blue-950 to-blue-900 border-b-border border-b-[1px] flex justify-between items-center align-middle">
      <Link href={"/"}>
        <Button
          variant={"ghost"}
          className="hover:bg-transparent p-0 align-middle"
        >
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
      <div className="flex align-middle gap-2">
        <SignInButton />
        {userId && <NotificationButton notifications={notifications} />}
        <ThemeButton />
      </div>
    </nav>
  );
}
