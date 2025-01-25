import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <p>404 - Page not found</p>
      <Link href={"/"} className={buttonVariants({})}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
