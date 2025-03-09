import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="h-full md:w-[60vw] mx-auto flex flex-col items-center p-4 gap-4">
      <Skeleton className="w-[30vw] h-[32px]" />
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-full h-[100px]" />
    </main>
  );
}
