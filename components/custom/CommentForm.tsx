"use client";
import { useSocket } from "@/lib/providers/socket-provider";
import { cn } from "@/lib/utils";
import { useCommentStore } from "@/lib/zustand";
import { getCommentById } from "@/services/comment";
import { useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import LoginDialog from "./LoginDialog";

const formSchema = z.object({
  comment: z.string(),
});

export default function CommentForm({
  tickerId,
  parentId,
  setOpenComment,
  className,
}: {
  tickerId: number;
  parentId?: number;
  setOpenComment?: (newValue: boolean) => void;
  className?: string;
}) {
  const pathname = usePathname();
  const { user } = useClerk();
  const { socket } = useSocket();

  const [open, setOpen] = useState(false);

  const createComment = useCommentStore(
    useShallow((state) => state.createComment)
  );
  const commentUpdateStatus = useCommentStore(
    useShallow((state) => state.commentUpdateStatus)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) {
      setOpen(true);
    }

    if (!tickerId || !user?.fullName || !user.imageUrl) {
      console.log(tickerId, user?.fullName, user?.imageUrl, "Missing");
      return;
    }

    createComment({
      content: values.comment,
      tickerId,
      pathname,
      parentId,
      user: user as unknown as User,
    });

    form.reset();
    // console.log(pathname, values, user?.id);
  }

  useEffect(() => {
    if (socket === null || commentUpdateStatus !== "success") return;

    const sendNotification = async () => {
      if (parentId) {
        const receiver = await getCommentById(parentId);

        socket.emit("revalidate-notification", {
          receiverId: receiver?.userId,
        });
      }
    };

    sendNotification();
  }, [socket, commentUpdateStatus]);

  const initials = user?.fullName
    ? user?.fullName
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map((word) => word[0].toUpperCase())
        .join("")
    : "G";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "flex w-full gap-2 items-center")}
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex w-full gap-2 items-center">
              <FormLabel>
                <Avatar>
                  <AvatarImage src={user?.imageUrl || undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </FormLabel>
              <FormControl className="!mt-0">
                <Input
                  type="text"
                  placeholder="Comment.."
                  {...field}
                  className="w-full text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {setOpenComment && (
          <Button
            type="reset"
            className="flex-shrink-0"
            variant={"secondary"}
            onClick={() => setOpenComment(false)}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          size={"icon"}
          className="flex-shrink-0"
          disabled={form.watch("comment") === "" || form.formState.isLoading}
        >
          <ArrowUpIcon />
        </Button>
        <LoginDialog open={open} onOpenChange={setOpen} />
      </form>
    </Form>
  );
}
