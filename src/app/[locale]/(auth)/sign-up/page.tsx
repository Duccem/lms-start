import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/card";
import { GraduationCap } from "lucide-react";
import SignUpForm from "../_components/sign-up-form";
import ScholaIcon from "@/lib/ui/components/icons/schola";

export default function SignUpPage() {
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
            Regístrate para acceder a la plataforma de aprendizaje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}

