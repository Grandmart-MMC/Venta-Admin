// app/[lang]/dictionaries.ts
import "server-only";

const dictionaries = {
  en: () => import("../../public/dictionaries/en.json").then((module) => module.default),
  az: () => import("../../public/dictionaries/az.json").then((module) => module.default),
  ru: () => import("../../public/dictionaries/ru.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "az" | "ru") => dictionaries[locale]();