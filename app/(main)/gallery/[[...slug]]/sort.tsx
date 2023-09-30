"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/select";
import { GALLERY_PAGE } from "~/lib/constants/routes";

const options = {
  "most-popular": "Most Popular",
  new: "New",
};

export function Sort(props: { currentSorting: string }) {
  const [value, setValue] = useState(props.currentSorting);
  const router = useRouter();

  const handleValueChange = (value: string) => {
    setValue(value);
    router.push(`${GALLERY_PAGE}/${value}`);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger aria-label="Open Select Menu" className="w-[180px]">
        <SelectValue aria-label={value}>
          {options[value as keyof typeof options]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>
          {Object.entries(options).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
