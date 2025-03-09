-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_from_fkey" FOREIGN KEY ("from") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
