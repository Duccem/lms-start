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
    <div className="w-full flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">
            Bienvenido de nuevo, inicia sesión para continuar.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}

