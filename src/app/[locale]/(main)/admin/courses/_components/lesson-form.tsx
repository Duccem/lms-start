import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { createClient } from "@/lib/supabase/client";
import { upload } from "@/lib/supabase/storage";
import { Button } from "@/lib/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/card";
import { Checkbox } from "@/lib/ui/components/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/lib/ui/components/radio-group";
import { RichText } from "@/lib/ui/components/rich-text";
import { Separator } from "@/lib/ui/components/separator";
import { Textarea } from "@/lib/ui/components/textarea";
import VideoPicker from "@/lib/ui/components/video-picker";
import { Lesson } from "@/modules/course/domain/lesson";
import { saveLesson } from "@/modules/course/infrastructure/api/http-course-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Sparkle, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  position: z.coerce.number().int().min(0, "Position must be a non-negative integer"),
  type: z.enum(["video", "article", "quiz"]).default("video").optional(), // Optional type field
  article: z
    .object({
      content: z.string().min(1, "Article content is required"),
    })
    .optional(), // Placeholder for article content
  video: z
    .object({
      duration: z.number().min(0, "Video duration must be a non-negative number"),
    })
    .optional(),
  quiz: z
    .object({
      timeLimit: z.coerce.number().min(0, "Time limit must be a non-negative number").optional(),
      passingScore: z.coerce
        .number()
        .min(0, "Passing score must be a non-negative number")
        .optional(),
      maxAttempts: z.coerce.number().int().min(1, "Max attempts must be at least 1").optional(),
      weight: z.coerce.number().min(0, "Weight must be a non-negative number").optional(),
      questions: z.array(
        z.object({
          question: z.string().min(1, "Question is required"),
          options: z.array(
            z.object({
              option: z.string().min(1, "Option is required"),
              isCorrect: z.boolean().optional().default(false),
            }),
          ),
        }),
      ),
    })
    .optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export const LessonForm = ({
  data,
  chapterId,
  courseId,
  lessonsLength,
  closeSheet,
}: {
  data?: Primitives<Lesson>;
  chapterId: string;
  courseId: string;
  lessonsLength: number;
  closeSheet?: () => void; // Optional closeSheet function if needed
}) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      content: data?.content || "",
      position: data?.position ?? lessonsLength + 1,
      type: data?.type || "video",
      article: data?.article ? { content: data.article.content } : undefined,
      video: data?.video ? { duration: data.video.duration } : undefined, // Default duration to 0 if not provided
      quiz: data?.quiz
        ? {
            timeLimit: data.quiz.timeLimit ?? 0,
            passingScore: data.quiz.passingScore ?? 0,
            maxAttempts: data.quiz.maxAttempts ?? 1,
            weight: data.quiz.weight ?? 0,
            questions: data.quiz.questions.map((question) => ({
              question: question.question,
              options: question.options.map((option) => ({
                option: option.option,
                isCorrect: option.isCorrect || false, // Default to false if not provided
              })),
            })),
          }
        : undefined, // Default to undefined if no quiz data
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quiz.questions",
  });
  const { isSubmitting } = form.formState;
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (values: FormSchema) => {
      let thumbnailUrl = data?.thumbnail;
      let videoUrl = data?.video?.video;
      if (thumbnail && thumbnail.name !== "initial-file") {
        thumbnailUrl = await upload(supabase, {
          bucket: "lesson-thumbnails",
          path: [thumbnail.name],
          file: thumbnail,
        });
      }

      if (values.type === "video" && video && video.name !== "initial-file") {
        videoUrl = await upload(supabase, {
          bucket: "lesson-videos",
          path: [video.name],
          file: video,
        });
      }
      await saveLesson(courseId, chapterId, {
        ...values,
        thumbnail: thumbnailUrl,
        id: data?.id ?? Uuid.random().value,
        chapterId: chapterId,
        video:
          values.type === "video"
            ? { duration: values.video?.duration, video: videoUrl }
            : undefined,
        quiz: values.type === "quiz" ? values.quiz : undefined,
        article: values.type === "article" ? { content: values.article?.content } : undefined,
      } as any);
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
      closeSheet?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const submit = async (values: FormSchema) => {
    try {
      await mutateAsync(values);
      toast.success("Lección guardada correctamente");
      if (closeSheet) {
        closeSheet(); // Close the sheet if closeSheet function is provided
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Error al guardar la lección");
    }
  };

  const secondsToMinutes = (seconds: number): number => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return Number((minutes + remainingSeconds / 60).toFixed(2));
  };

  useEffect(() => {
    if (video) {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src); // Clean up the object URL
        form.setValue("video.duration", secondsToMinutes(videoElement.duration));
      };
      videoElement.src = URL.createObjectURL(video);
    }
  }, [video]);

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(submit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 "
      >
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
            <CardDescription>
              Aquí puedes editar la información básica de la lección, como el título y la
              descripción.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Lección 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea placeholder="En esta lección..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImagePicker
              placeholder="Portada de la lección"
              setFileAction={(file) => setThumbnail(file)}
              value={data?.thumbnail}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posición</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              Guardar Capitulo
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkle />}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contenido de la clase</CardTitle>
            <CardDescription>
              Aquí puedes seleccionar el tipo de lección y agregar el contenido correspondiente.
              Puedes elegir entre video, artículo o examen.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de lección</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-between items-center"
                    >
                      <FormItem className="flex  items-center p-3 gap-3 border border-primary flex-1 space-y-0 rounded-lg">
                        <FormControl>
                          <RadioGroupItem value="video" />
                        </FormControl>
                        <FormLabel className="font-normal">Video</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center p-3 gap-3 border border-primary flex-1 space-y-0 rounded-lg">
                        <FormControl>
                          <RadioGroupItem value="quiz" />
                        </FormControl>
                        <FormLabel className="font-normal">Examen</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center p-3 gap-3 border border-primary flex-1 space-y-0 rounded-lg">
                        <FormControl>
                          <RadioGroupItem value="article" />
                        </FormControl>
                        <FormLabel className="font-normal">Articulo</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="bg-primary" />
            {form.watch("type") === "article" && (
              <FormField
                control={form.control}
                name="article.content"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel>Contenido</FormLabel>
                    <FormControl>
                      <RichText field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {form.watch("type") === "video" && (
              <VideoPicker
                placeholder="Agrega el video de tu clase"
                setFileAction={(file) => setVideo(file)}
              />
            )}
            {form.watch("type") === "quiz" && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                  <FormField
                    control={form.control}
                    name={`quiz.timeLimit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo del examen</FormLabel>
                        <FormControl>
                          <Input placeholder="Tiempo limite en segundos" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`quiz.passingScore`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puntaje mínimo </FormLabel>
                        <FormControl>
                          <Input placeholder="Puntaje de aprobación" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`quiz.maxAttempts`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intentos máximos</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de intentos permitidos"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`quiz.weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso del examen</FormLabel>
                        <FormControl>
                          <Input placeholder="Peso del examen" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">Preguntas</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        question: "",
                        options: [],
                      })
                    }
                  >
                    <Plus className="" />
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 mb-4 border border-primary rounded-lg p-3"
                  >
                    <FormField
                      control={form.control}
                      name={`quiz.questions.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Pregunta {index + 1}</FormLabel>
                            <Button type="button" variant={"ghost"} onClick={() => remove(index)}>
                              <Trash2 />
                            </Button>
                          </div>
                          <FormControl>
                            <Input placeholder="¿Cuál es la capital de Francia?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <LessonQuestionOptions control={form.control as any} index={index} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export const LessonQuestionOptions = ({ control, index }: { control: Control; index: number }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `quiz.${index}.options`,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">Opciones</p>
        <Button variant={"outline"} onClick={() => append({ option: "" })} type="button">
          <Plus />
        </Button>
      </div>

      {fields.map((field, optionIndex) => (
        <div className="flex items-center gap-2 w-full" key={field.id}>
          <FormField
            control={control}
            name={`quiz.${index}.options.${optionIndex}.option`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 flex-1">
                <FormControl>
                  <Input placeholder={`Opción ${optionIndex + 1}`} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`quiz.${index}.options.${optionIndex}.isCorrect`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="button" variant={"ghost"} onClick={() => remove(optionIndex)}>
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
};
