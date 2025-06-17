"use client";

import { I18nProviderClient } from "@/lib/translation/client";

export const Providers = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;

