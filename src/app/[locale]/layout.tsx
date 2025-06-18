import "@/assets/globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Providers } from "./providers";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scholar Pro",
  description: "A modern learning management system",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}

