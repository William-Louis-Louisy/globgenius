import "@/app/globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { hasLocale } from "next-intl";
import Providers from "../providers";
import { Montserrat, Poppins, Quicksand } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "GlobGenius",
  description:
    "Joue, progresse, et maîtrise drapeaux, capitales et frontières, un défi à la fois.",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
    console.error(error);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`antialiased ${montserrat.variable} ${poppins.variable} ${quicksand.variable}`}
      >
        <Providers locale={locale} messages={messages}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
