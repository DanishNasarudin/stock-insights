import { SignIn } from "@clerk/nextjs";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="flex justify-center h-[100vh] items-center">
      <SignIn />
    </div>
  );
}
