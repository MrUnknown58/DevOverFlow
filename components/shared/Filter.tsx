"use client";
import React, { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
  userLocation?: string;
}
const Filter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
  userLocation = "India",
}: FilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get("filter") || "";
  const pathname = usePathname();

  // ...

  const handleUpdateParams = useCallback(
    (value: string) => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value,
      });
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  // useEffect(() => {
  //   pathname === "/jobs" && handleUpdateParams(userLocation);
  // }, [handleUpdateParams, userLocation, pathname]);
  return (
    <div className={`relative ${containerClasses}`}>
      {/* {filters.map((filter: any) => (
        <FilterItem key={filter.id} filter={filter} />
      ))} */}
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={
          paramFilter || pathname === "/jobs" ? userLocation : undefined
        }
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((filter: any) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
