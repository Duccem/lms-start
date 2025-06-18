import { authClient } from "@/lib/auth/client";
import { BetterUser } from "@/lib/auth/server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/lib/ui/components/avatar";
import { buttonVariants } from "@/lib/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/lib/ui/components/dropdown-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignedUser = ({ user }: { user: BetterUser }) => {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };
  return (
    <>
      <Link href={"/home"} className={buttonVariants()}>
        Dashboard
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.image ?? ""}></AvatarImage>
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10}>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Cursos</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            Salir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default SignedUser;

