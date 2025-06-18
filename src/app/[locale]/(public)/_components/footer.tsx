import Github from "@/lib/ui/components/icons/github";
import LinkedIn from "@/lib/ui/components/icons/linkedin";
import ScholaIcon from "@/lib/ui/components/icons/schola";
import { Facebook, Instagram, XIcon } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="overflow-hidden py-8 space-y-12 px-3 max-w-7xl mx-auto mt-10">
      <div className="flex items-center justify-center w-full gap-2">
        <ScholaIcon className="size-12" />
        <p className="text-2xl">
          Schola <span className="text-primary">Pro</span>
        </p>
      </div>
      <div className="flex items-center justify-center w-full py-2 text-lg gap-6  flex-wrap">
        <Link href={""} className="underline">
          Nosotros
        </Link>
        <Link href={""} className="underline">
          Terapeutas
        </Link>
        <Link href={""} className="underline">
          Blog
        </Link>
        <Link href={""} className="underline">
          Recursos
        </Link>
        <Link href={""} className="underline">
          Beneficiencia
        </Link>
      </div>
      <div className="flex items-center justify-center w-full py-2 gap-6">
        <Link
          href="https://instagram.com"
          className="rounded-full bg-brand-primary text-white p-3 hover:bg-violet-500 transition-colors"
        >
          <Instagram size={20} />
        </Link>
        <Link
          href="https://facebook.com"
          className="rounded-full bg-brand-primary text-white p-3 hover:bg-violet-500 transition-colors"
        >
          <Facebook size={20} />
        </Link>
        <Link
          href="https://linkedin.com"
          className="rounded-full bg-brand-primary text-white p-3 hover:bg-violet-500 transition-colors"
        >
          <LinkedIn color="#fff" />
        </Link>
        <Link
          href="https://twitter.com"
          className="rounded-full bg-brand-primary text-white p-3 hover:bg-violet-500 transition-colors"
        >
          <XIcon />
        </Link>
        <Link
          href="https://twitter.com"
          className="rounded-full bg-brand-primary text-white p-3 hover:bg-violet-500 transition-colors"
        >
          <Github />
        </Link>
      </div>
      <div className="flex items-center justify-center w-full py-2 text-lg gap-6 font-semibold text-gray-500 flex-wrap">
        <Link href={""}>Aviso legal</Link>
        <Link href={""}>Condiciones generales</Link>
        <Link href={""}>Política de privacidad</Link>
        <Link href={""}>Recursos</Link>
        <Link href={""}>Política de cookies</Link>
      </div>
    </footer>
  );
};

export default Footer;

