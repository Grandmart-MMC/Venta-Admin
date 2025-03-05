"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Locale = "en" | "ru" | "az";

export default function LanguageSwitcher({ t }: { t: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLang = (params?.lang ?? "en") as Locale;

  const handleLanguageChange = (newLang: string) => {
    if (!pathname) return;
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <Select value={currentLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={t[currentLang]} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value="en">🇺🇸 {t.en}</SelectItem>
        <SelectItem className="cursor-pointer" value="ru">🇷🇺 {t.ru}</SelectItem>
        <SelectItem className="cursor-pointer" value="az">🇦🇿 {t.az}</SelectItem>
      </SelectContent>
    </Select>
  );
}
