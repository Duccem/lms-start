"use client";
import { BetterSession } from "@/lib/auth/server";
import ScholaIcon from "@/lib/ui/components/icons/schola";
import Link from "next/link";
import { use } from "react";
import SignedUser from "./signed-user";
import ToggleTheme from "./toggle-theme";
import UnsignedUser from "./unsigned-user";

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Cursos", href: "/courses" },
  { name: "Acerca de", href: "/about" },
  { name: "Contacto", href: "/contact" },
];

const Header = ({ session }: { session: Promise<BetterSession | null> }) => {
  const user = use(session);
  return (
    <header className="w-full mx-auto  sticky top-0 bg-background/95 border-b py-2 backdrop-blur-md hidden md:block">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ScholaIcon className="size-12" />
          <p className="text-2xl">
            Schola <span className="text-primary">Pro</span>
          </p>
        </div>
        <nav>
          <ul className="flex justify-center items-center">
            {navItems.map((item) => (
              <li key={item.name} className="mx-2">
                <Link
                  href={item.href}
                  className="hover:underline text-sm hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {user ? <SignedUser user={user.user} /> : <UnsignedUser />}
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
};

export default Header;

