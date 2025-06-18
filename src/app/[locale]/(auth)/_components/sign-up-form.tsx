"use client";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/lib/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/components/form";
import Google from "@/lib/ui/components/icons/google";
import Microsoft from "@/lib/ui/components/icons/microsoft";
import { Input } from "@/lib/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/lib/ui/components/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormSchema = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const [emailSended, setEmailSended] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "all",
  });

  const { isSubmitting } = form.formState;

  const socialSignUp = async (provider: "google" | "microsoft") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/home",
    });
  };

  const submit = async (data: FormSchema) => {
    try {
      await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setEmailSended(true);
      // Redirect or show success message
      console.log("Registro exitoso");
    } catch (error) {
      console.error("Error al registrarse:", error);
      // Handle error (e.g., show error message)
    }
  };

  const verify = async () => {
    try {
      setVerifyingEmail(true);
      await authClient.emailOtp.verifyEmail({
        email: form.getValues("email"),
        otp: otpCode,
      });
      toast.success("Correo verificado exitosamente, seras redirigido");
      router.push("/home");
      console.log("Verificación exitosa");
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      toast.error(
        "Error al verificar el correo. Por favor, inténtalo de nuevo."
      );
      // Handle error (e.g., show error message)
    } finally {
      setVerifyingEmail(false);
    }
  };

  if (emailSended) {
    return (
      <div className="flex flex-col items-center  justify-center h-full space-y-4">
        <p className="text-sm text-muted-foreground">
          Hemos enviado un correo con tu código de verificación a tu correo
          electrónico. Por favor, verifica tu bandeja de entrada y sigue las
          instrucciones para completar el registro.
        </p>

        <InputOTP
          maxLength={6}
          className="w-full"
          value={otpCode}
          onChange={setOtpCode}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button
          size="lg"
          className="w-full"
          onClick={verify}
          disabled={!otpCode || verifyingEmail}
        >
          {verifyingEmail ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Verificar Email"
          )}
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">
            <Button
              variant="link"
              className="text-primary underline underline-offset-4 cursor-pointer"
              onClick={() => {
                setEmailSended(false);
                form.reset();
              }}
            >
              Volver al registro
            </Button>
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Si ya tienes una cuenta, puedes{" "}
          <Link
            href="/auth/sign-in"
            className="text-primary underline underline-offset-4"
          >
            iniciar sesión aquí
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(submit, (e) => console.log(e))}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Tu nombre completo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Tu correo de contacto principal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Tu clave de seguridad"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size={"lg"}
          className="w-full"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Registrarse"
          )}
        </Button>
      </form>
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full border-b-2"></div>
          <p>O</p>
          <div className="w-full border-b-2"></div>
        </div>
        <div className="flex flex-col gap-4">
          <Button onClick={() => socialSignUp("google")}>
            <Google />
            Continuar con Google
          </Button>
          <Button onClick={() => socialSignUp("microsoft")}>
            <Microsoft />
            Continuar con Microsoft
          </Button>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary underline underline-offset-4"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Al registrarte, aceptas nuestros{" "}
          <Link href="#" className="text-primary underline underline-offset-4">
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link href="#" className="text-primary underline underline-offset-4">
            Política de privacidad
          </Link>
          .
        </div>
      </div>
    </Form>
  );
};

export default SignUpForm;

