import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/card";
import ScholaIcon from "@/lib/ui/components/icons/schola";
import SignInForm from "../_components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center flex-col justify-between">
            <CardTitle className="text-2xl">
              Scholar <span className="text-blue-300">Pro</span>
            </CardTitle>
            <ScholaIcon className="size-24" />
          </div>
          <CardDescription className="text-lg">
            Bienvenido de nuevo, inicia sesión para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}

