import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full md:max-w-[80vw] mx-auto h-full">
      <div className="py-4 space-y-2">
        <Skeleton className="w-[30vw] h-[32px]" />
        <Skeleton className="w-full h-[32px]" />
      </div>
      <div className="flex sm:flex-row flex-col gap-4 w-full h-full">
        <Skeleton className="w-full h-[300px]" />
        <Skeleton className="w-full h-[300px]" />
      </div>
      <div className="flex sm:flex-row flex-col gap-4 w-full h-full">
        <Skeleton className="w-full h-[300px]" />
        <Skeleton className="w-full h-[300px]" />
      </div>
    </div>
  );
};

export default loading;
