import { Badge } from "@/lib/ui/components/badge";
import { buttonVariants } from "@/lib/ui/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/card";
import Link from "next/link";

const features = [
  {
    title: "Cursos Interactivos",
    description:
      "Crea cursos con contenido interactivo, videos, quizzes y más.",
  },
  {
    title: "Seguimiento del Progreso",
    description:
      "Monitora el avance de tus estudiantes y proporciona retroalimentación personalizada.",
  },
  {
    title: "Comunidad Activa",
    description:
      "Fomenta la colaboración entre estudiantes con foros y grupos de estudio.",
  },
  {
    title: "Integraciones Poderosas",
    description:
      "Conecta Schola Pro con herramientas populares para una experiencia completa.",
  },
];

export default function Home() {
  return (
    <div className="w-full h-full">
      <section className="py-20 max-w-7xl mx-auto w-full h-full flex flex-col items-center justify-center gap-4">
        <Badge variant={"outline"} className="rounded-full  px-3 py-2 text-lg">
          El futuro de la educación en linea
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          Mejora la experiencia de aprendizaje con Schola{" "}
          <span className="text-primary">Pro</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-2xl text-center">
          Descubre una nueva forma de ofrecer cursos en linea, con una
          plataforma diseñada para potenciar la enseñanza y el aprendizaje.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href={"/courses"} className={buttonVariants({ size: "lg" })}>
            Explorar Cursos
          </Link>
          <Link
            href={"/courses"}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Entrar
          </Link>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}

