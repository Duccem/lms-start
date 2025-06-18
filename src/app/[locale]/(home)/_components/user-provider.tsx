"use client";

import { BetterUser } from "@/lib/auth/server";
import { createContext, useContext } from "react";

const SessionContext = createContext<{ user: BetterUser } | undefined>(
  undefined
);

export const SessionProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: BetterUser;
}) => {
  return (
    <SessionContext.Provider value={{ user }}>
      {children}
    </SessionContext.Provider>
  );
};
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

