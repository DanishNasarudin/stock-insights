"use client";
import { createURL } from "@/lib/utils";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "../ui/input";

export default function Inputs() {
  const [value, setValue] = useState("");
  const [searchValues] = useDebounce(value, 500);

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
      />
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
