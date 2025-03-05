export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "az" }, { lang: "ru" }];
}

export default async function LanguageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
