import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <>
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-full h-[100px]" />
    </>
  );
}
