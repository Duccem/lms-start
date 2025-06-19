"use client";

import { queryClient } from "@/lib/api/query-client";
import { I18nProviderClient } from "@/lib/translation/client";
import { Toaster } from "@/lib/ui/components/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const Providers = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => (
  <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
    <NuqsAdapter>
      <I18nProviderClient locale={locale}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </I18nProviderClient>
    </NuqsAdapter>
    <Toaster />
  </ThemeProvider>
);

