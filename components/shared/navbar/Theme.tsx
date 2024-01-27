"use client";
import React from "react";
import { useTheme } from "@/context/ThemeProvider";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { themes } from "@/constants";
const Theme = () => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Menubar className="relative border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
            {theme === "dark" ? (
              <Image
                src="/assets/icons/moon.svg"
                width={20}
                height={20}
                className="active-theme"
                alt="moon"
              />
            ) : (
              <Image
                src="/assets/icons/sun.svg"
                alt="sun"
                width={20}
                height={20}
                className="active-theme"
              />
            )}
          </MenubarTrigger>
          <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300">
            {themes.map((item) => (
              <MenubarItem
                key={item.value}
                className="flex cursor-pointer items-center justify-between rounded px-4 py-2 text-sm hover:bg-light-900 focus:bg-light-800 dark:hover:bg-dark-200 dark:focus:bg-dark-400"
                onClick={() => {
                  setTheme(item.value);
                  if (item.value !== "System") {
                    localStorage.theme = item.value;
                  } else {
                    localStorage.removeItem("theme");
                  }
                }}
              >
                <Image
                  src={item.icon}
                  width={16}
                  height={16}
                  alt={item.value}
                  className={`${theme === item.value && "active-theme"}`}
                />
                <span
                  className={`body-semibold ${
                    theme === item.value
                      ? "text-primary-500"
                      : "text-dark100_light900"
                  } text-primary-500`}
                >
                  {item.label}
                </span>
                {/* {theme === item.value && (
                  <Image
                    src="/assets/icons/check.svg"
                    width={16}
                    height={16}
                    alt="check"
                    className={`${theme === item.value && "active-theme"} `}
                  />
                )} */}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
};

export default Theme;
