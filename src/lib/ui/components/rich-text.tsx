"use client";

import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Toggle } from "./toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export const RichText = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] })],
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] max-h-[400px] p-4 focus-visible:outline-none prose prose-sm !w-full !max-w-none ",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<h3>Mi curso 🚀<h3>",
  });

  return (
    <div className="w-full border border-input rounded-lg dark:bg-input/30 overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="border-b border-input rounded-t-lg p-2 bg-card flex gap-1 flex-wrap items-center">
      <TooltipProvider>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("bold"),
                })}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Negrita</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("italic"),
                })}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cursiva</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("strike"),
                })}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tachar</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("heading", { level: 1 }),
                })}
              >
                <Heading1 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Encabezado 1</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("heading", { level: 2 }),
                })}
              >
                <Heading2 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Encabezado 2</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("heading", { level: 3 }),
                })}
              >
                <Heading3 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Encabezado 3</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("bulletList"),
                })}
              >
                <List />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lista sin orden</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive("orderedList"),
                })}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lista ordenada</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="w-px h-6 bg-gray-600 mx-2"></div>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive({ textAlign: "left" }),
                })}
              >
                <AlignLeft />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Alinear a la izquierda</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive({ textAlign: "center" }),
                })}
              >
                <AlignCenter />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Alinear al centro</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive({ textAlign: "right" }),
                })}
              >
                <AlignRight />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Alinear a la derecha</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
                className={cn({
                  "bg-muted text-muted-foreground": editor.isActive({ textAlign: "justify" }),
                })}
              >
                <AlignJustify />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Alinear justificado</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="w-px h-6 bg-gray-600 mx-2"></div>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                onClick={() => {
                  editor.chain().focus().undo().run();
                }}
                disabled={!editor.can().undo()}
              >
                <Undo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Deshacer</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                onClick={() => {
                  editor.chain().focus().redo().run();
                }}
                disabled={!editor.can().undo()}
              >
                <Redo2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rehacer</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};
