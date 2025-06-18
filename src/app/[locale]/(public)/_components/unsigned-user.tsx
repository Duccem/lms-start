import { buttonVariants } from "@/lib/ui/components/button";
import Link from "next/link";

const UnsignedUser = () => {
  return (
    <>
      <Link href={"/sign-in"} className={buttonVariants()}>
        Entrar
      </Link>
      <Link
        href={"/sign-up"}
        className={buttonVariants({ variant: "secondary" })}
      >
        Registrarse
      </Link>
    </>
  );
};

export default UnsignedUser;

