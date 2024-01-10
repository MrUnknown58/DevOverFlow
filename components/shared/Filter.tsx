"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterProps {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
}
const Filter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
}: FilterProps) => {
  return (
    <div className={`relative ${containerClasses}`}>
      {/* {filters.map((filter: any) => (
        <FilterItem key={filter.id} filter={filter} />
      ))} */}
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((filter: any) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="text-left"
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
