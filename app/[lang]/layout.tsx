import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "az" }, { lang: "ru" }];
}

export default async function LanguageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
