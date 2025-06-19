"use client";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { createClient } from "@/lib/supabase/client";
import { upload } from "@/lib/supabase/storage";
import { Button } from "@/lib/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/components/form";
import ImagePicker from "@/lib/ui/components/image-picker";
import { Input } from "@/lib/ui/components/input";
import { RichText } from "@/lib/ui/components/rich-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/components/select";
import { Textarea } from "@/lib/ui/components/textarea";
import { Course } from "@/modules/course/domain/course";
import { createCourse } from "@/modules/course/infrastructure/api/http-course-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Rocket, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  summary: z.string().min(10, "Summary must be at least 10 characters long"),
  price: z.coerce.number().min(1, "Price must be a non-negative number"),
  duration: z.coerce.number().min(0, "Duration must be a non-negative integer"),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner").optional(),
  category: z.string().min(1, "Category is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and can only contain letters, numbers, and hyphens",
    ),
  status: z.enum(["draft", "published", "archived"]).default("draft").optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const validCategories = [
  "Programming",
  "Design",
  "Marketing",
  "Business",
  "Data Science",
  "Personal Development",
  "Health & Fitness",
  "Music",
  "Photography",
  "Language Learning",
];

const validLevels = ["beginner", "intermediate", "advanced"];

export const CreateCourseForm = ({ data }: { data?: Primitives<Course> }) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      slug: data?.slug || "",
      summary: data?.summary || "",
      description: data?.description || "",
      price: data?.price || 0,
      duration: data?.duration || 0,
      category: data?.category || "",
      status: data?.status || "draft",
      level: data?.level || "beginner",
    },
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { mutateAsync, mutate } = useMutation({
    mutationFn: async (values: FormSchema) => {
      let thumbnailUrl = data?.thumbnail;
      if (thumbnail && thumbnail.name !== "initial-file") {
        thumbnailUrl = await upload(supabase, {
          bucket: "course-thumbnails",
          path: [thumbnail.name],
          file: thumbnail,
        });
      }
      const courseData = {
        ...values,
        thumbnail: thumbnailUrl,
        id: data?.id || Uuid.random().toString(), // Use existing ID if editing, otherwise create a new one
      };
      await createCourse(courseData as any); // Adjust type as needed
    },
    onError: (error) => {
      console.error("Error saving course:", error);
      toast.error("Error guardando el curso");
    },
    onSuccess: () => {
      toast.success("Curso guardado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["courses"] }); // Adjust query key as needed
      queryClient.invalidateQueries({ queryKey: ["course", data?.id] }); // Adjust query key as needed
      router.push("/admin/courses");
    },
  });
  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(
          async (data: FormSchema) => {
            await mutateAsync(data);
          },
          (e) => console.error(e),
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Mi asombroso curso" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end gap-4 w-full">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="mi-asombroso-curso" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="h-10"
            type="button"
            onClick={() => {
              const title = form.getValues("title");
              const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              form.setValue("slug", slug);
            }}
          >
            Generar slug
            <Sparkles />
          </Button>
        </div>
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumen</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none min-h-[100px]" rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <RichText field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImagePicker
          placeholder="Portada del curso"
          setFileAction={(file) => setThumbnail(file)}
          value={data?.thumbnail}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {validCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nivel</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un nivel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {validLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (Horas)</FormLabel>
                <FormControl>
                  <Input {...field} type={"number"} placeholder="8" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (USD)</FormLabel>
                <FormControl>
                  <Input {...field} type={"number"} placeholder="8" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Estatus</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estatus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Guardar curso
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Rocket className="size-4" />
          )}
        </Button>
      </form>
    </Form>
  );
};
