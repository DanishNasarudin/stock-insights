import { SignIn } from "@clerk/clerk-react";
import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  open?: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export default function LoginDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to Comment!</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex w-full justify-center items-center">
          <SignIn />
        </div>
      </DialogContent>
    </Dialog>
  );
}
