import ScholaIcon from "@/lib/ui/components/icons/schola";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-3">
      <Link href={"/"} className="flex items-center gap-2 my-3 underline">
        <ArrowLeft className="size-4" />
        <span className="text-sm ml-2">Volver al inicio</span>
      </Link>
      <div className="flex items-center  justify-between gap-2">
        <ScholaIcon className="size-12" />
        <p className="text-2xl">
          Schola <span className="text-blue-300">Pro</span>
        </p>
      </div>
      {children}
    </div>
  );
}

