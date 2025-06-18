"use client";

import { Button } from "@/lib/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ToggleTheme = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return (
    <Button size={"icon"} onClick={toggleTheme} className="cursor-pointer">
      <Moon className="size-5 hidden dark:block " />
      <Sun className="size-5 dark:hidden" />
    </Button>
  );
};

export default ToggleTheme;

