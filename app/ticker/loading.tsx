import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <main className="w-[60vw] h-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4">
      <Skeleton className="w-full h-[300px]" />
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-full h-[100px]" />
      <Skeleton className="w-full h-[100px]" />
    </main>
  );
}
