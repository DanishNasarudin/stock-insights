"use client";
import { createURL } from "@/lib/utils";
import { Loader2Icon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "../ui/input";

export default function Inputs() {
  const [value, setValue] = useState("");
  const [searchValues] = useDebounce(value, 500);

  const isLoading = useMemo(
    () => value !== searchValues,
    [value, searchValues]
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setSearchParams = new URLSearchParams(searchParams);

  useEffect(() => {
    if (searchValues) {
      setSearchParams.set("search", searchValues);
    } else {
      setSearchParams.delete("search");
    }

    const setURL = createURL(`${pathname}/`, setSearchParams);
    router.push(setURL);
  }, [pathname, searchValues, searchParams]);

  return (
    <div className="relative">
      <Input
        isSearch
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter stock ticker"
        className="text-base"
      />
      {isLoading && (
        <div className="absolute top-[50%] translate-y-[-50%] right-8">
          <Loader2Icon className="animate-spin stroke-zinc-400 w-4" />
        </div>
      )}
      {value && (
        <X
          size={14}
          className="absolute top-[50%] right-2 translate-y-[-50%] stroke-zinc-400 cursor-pointer"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
}
