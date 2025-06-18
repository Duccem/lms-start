import { getSession } from "@/lib/auth/server";
import Footer from "./_components/footer";
import Header from "./_components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSession();
  return (
    <div className="w-full h-full py-4">
      <Header session={session} />
      <main className="w-full h-full">{children}</main>
      <Footer />
    </div>
  );
}

