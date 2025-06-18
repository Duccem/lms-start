import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/card";
import { ArrowLeft, GraduationCap } from "lucide-react";
import SignUpForm from "../_components/sign-up-form";
import ScholaIcon from "@/lib/ui/components/icons/schola";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className=" w-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">
            Regístrate para acceder a la plataforma de aprendizaje.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}

