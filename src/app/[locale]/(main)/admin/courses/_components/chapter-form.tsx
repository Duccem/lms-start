import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Button } from "@/lib/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/components/form";
import { Input } from "@/lib/ui/components/input";
import { Textarea } from "@/lib/ui/components/textarea";
import { Chapter } from "@/modules/course/domain/chapter";
import { saveChapter } from "@/modules/course/infrastructure/api/http-course-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  position: z.coerce.number().int().min(0, "Position must be a non-negative integer"),
});

type FormSchema = z.infer<typeof formSchema>;

export const ChapterForm = ({
  data,
  courseId,
  chaptersLength,
  closeSheet,
}: {
  data?: Primitives<Chapter>;
  courseId: string;
  chaptersLength: number;
  closeSheet?: () => void; // Optional closeSheet function if needed
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      position: data?.position || chaptersLength,
    },
  });
  const { isSubmitting } = form.formState;
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (values: FormSchema) => {
      await saveChapter(courseId, {
        ...values,
        id: data?.id ?? Uuid.random().value, // Include id if editing an existing chapter
      });
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
    },
  });
  const submit = async (values: FormSchema) => {
    try {
      await mutateAsync(values);
      toast.success("Capitulo guardado correctamente");
      if (closeSheet) {
        closeSheet(); // Close the sheet if closeSheet function is provided
      }
    } catch (error) {
      toast.error("Error al guardar el capitulo");
      console.error("Error saving chapter:", error);
    }
  };

  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input placeholder="Capitulo 1" {...field} />
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
                <Textarea placeholder="En este capitulo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <Input type="number" placeholder="En este capitulo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Guardar Capitulo
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkle />}
        </Button>
      </form>
    </Form>
  );
};
