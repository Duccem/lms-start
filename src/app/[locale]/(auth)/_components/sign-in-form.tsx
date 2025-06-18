"use client";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/lib/ui/components/button";
import { Checkbox } from "@/lib/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/components/form";
import Google from "@/lib/ui/components/icons/google";
import Microsoft from "@/lib/ui/components/icons/microsoft";
import { Input } from "@/lib/ui/components/input";
import { Label } from "@/lib/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const SignInForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();

  const socialSignIn = async (provider: "google" | "microsoft") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/home",
    });
  };

  const enter = async (data: FormSchema) => {
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        callbackURL: "/home",
      });
      toast.success("¡Has iniciado sesión correctamente!");
      form.reset();
      router.push("/home");
    } catch (error) {
      console.error(error);
      toast.error(
        "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(enter, (e) => console.error(e))}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="o@ejemplo.com" />
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
                <Input {...field} placeholder="******" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel>Recuérdeme</FormLabel>
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
            "Entrar"
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
          <Button onClick={() => socialSignIn("google")}>
            <Google />
            Continuar con Google
          </Button>
          <Button onClick={() => socialSignIn("microsoft")}>
            <Microsoft />
            Continuar con Microsoft
          </Button>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            ¿Aun no tienes una cuenta?{" "}
            <Link
              href="/sign-up"
              className="text-primary underline underline-offset-4"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </Form>
  );
};

export default SignInForm;

