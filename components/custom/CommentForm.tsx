"use client";
import { cn } from "@/lib/utils";
import { useCommentStore } from "@/lib/zustand";
import { useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { Avatar, AvatarFallback } from "../ui/avatar";
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

  const [open, setOpen] = useState(false);

  const createComment = useCommentStore(
    useShallow((state) => state.createComment)
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
      userId: user.id,
    });

    form.reset();
    console.log(pathname, values, user?.id);
  }

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
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
              </FormLabel>
              <FormControl className="!mt-0">
                <Input
                  type="text"
                  placeholder="Comment.."
                  {...field}
                  className="w-full"
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
