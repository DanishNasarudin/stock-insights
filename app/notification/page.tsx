import NotificationCard from "@/components/custom/NotificationCard";
import Placeholder from "@/components/custom/Placeholder";
import { getNotificationByUser } from "@/services/notification";
import { auth } from "@clerk/nextjs/server";
import { BellIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const notifications = await getNotificationByUser({ userId });

  return (
    <main className="h-full md:w-[60vw] mx-auto flex flex-col items-center p-4">
      <span className="font-bold text-lg">Notifications</span>
      <div className="flex flex-col gap-4 py-4 w-full">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            return (
              <NotificationCard
                key={notification.id}
                id={notification.id}
                userName={notification.fromUser.name}
                userImage={notification.fromUser.avatarSrc}
                timestamp={notification.createdAt}
                isRead={notification.isRead}
                comment={notification.comment!}
              />
            );
          })
        ) : (
          <Placeholder
            icon={BellIcon}
            title="You have zero notifications!"
            subtitle="Check again next time."
          />
        )}
      </div>
    </main>
  );
}
