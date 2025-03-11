"use client";
import { useSocket } from "@/lib/providers/socket-provider";
import { cn } from "@/lib/utils";
import { useCommentStore } from "@/lib/zustand";
import { getCommentById } from "@/services/comment";
import { useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon, MinusCircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
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
import { Textarea } from "../ui/textarea";
import LoginDialog from "./LoginDialog";

const formSchema = z.object({
  comment: z.string(),
});

const isMobile: boolean =
  typeof navigator !== "undefined" &&
  /android|iphone|ipad|ipod/i.test(navigator.userAgent);

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
    resetHeight();
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

  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current && width && width > 768) {
      textareaRef.current.focus();
      adjustHeight();
    }
  }, [width]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "37px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  // useEffect(() => {
  //   setLocalStorageInput(input);
  // }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setInput(event.target.value);
    adjustHeight();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "flex w-full gap-2 items-center relative")}
      >
        {setOpenComment && (
          <Button
            type="reset"
            className="flex-shrink-0 text-red-500 hover:text-red-500 absolute left-[-23.5px] top-[47%] translate-x-[-50%] translate-y-[-50%]"
            variant={"ghost"}
            size={"icon"}
            onClick={() => setOpenComment(false)}
          >
            <MinusCircleIcon />
          </Button>
        )}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex w-full gap-2 items-center">
              <FormLabel>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.imageUrl || undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </FormLabel>
              <FormControl className="!mt-0">
                <Textarea
                  rows={1}
                  draggable={false}
                  placeholder="Comment.."
                  {...field}
                  ref={(e) => {
                    field.ref(e);
                    textareaRef.current = e;
                  }}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    field.onChange(e);
                    handleInput(e);
                  }}
                  className="min-h-[24px] max-h-[calc(12dvh)] w-full text-base resize-none"
                  onKeyDown={(event) => {
                    if (!isMobile && event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      if (!form.formState.isLoading) {
                        form.handleSubmit(onSubmit)();
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
