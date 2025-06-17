"use client";

import { I18nProviderClient } from "@/lib/translation/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";

export const Providers = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => (
  <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
    <NuqsAdapter>
      <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
    </NuqsAdapter>
  </ThemeProvider>
);

