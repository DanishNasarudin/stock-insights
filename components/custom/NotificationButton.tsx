import { BellIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import TooltipWrapper from "./TooltipWrapper";

type Props = {};

export default function NotificationButton({
  notifications = 0,
}: {
  notifications?: number;
}) {
  return (
    <Link href={"/notification"}>
      <TooltipWrapper content="Notification">
        <Button variant={"outline"} size={"icon"} className="relative">
          <BellIcon />
          {notifications > 0 && (
            <div className="absolute top-0 right-0 w-4 h-4 p-[2px] pt-[2.5px] translate-x-[50%] translate-y-[-50%] rounded-full bg-red-500 text-white text-[10px] font-bold leading-none pointer-events-none select-none">
              {notifications > 99 ? "99+" : notifications}
            </div>
          )}
        </Button>
      </TooltipWrapper>
    </Link>
  );
}
