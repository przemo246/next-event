"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import TiptapLink from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";

import { cn } from "@/libs/cn";
import { Text } from "@/libs/ui/text";

/* =============================================================================
 * ToolbarButton
 * ============================================================================= */

type ToolbarButtonProps = {
  isActive?: boolean;
  label: string;
  onPress: () => void;
  children: React.ReactNode;
};

const ToolbarButton = ({ isActive, label, onPress, children }: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={isActive}
    onClick={onPress}
    className={cn(
      "flex size-8 cursor-pointer items-center justify-center text-foreground-secondary outline-none hover:text-accent",
      isActive && "bg-canvas-inset text-accent",
    )}
  >
    {children}
  </button>
);

/* =============================================================================
 * RichTextEditor
 * ============================================================================= */

type RichTextEditorProps = {
  name: string;
  label: string;
};

export const RichTextEditor = ({ name, label }: RichTextEditorProps) => {
  const [html, setHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      TiptapLink.configure({ openOnClick: false }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-32 px-4 py-3 text-[15px] text-foreground outline-none",
          "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
          "[&_a]:text-accent [&_a]:underline",
        ),
        "data-testid": "description-editor",
      },
    },
    onCreate: ({ editor }) => setHtml(editor.getHTML()),
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  const setLink = () => {
    if (!editor) return;

    const url = window.prompt("Wklej adres linku");

    if (!url) return;

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Text.Eyebrow>{label}</Text.Eyebrow>
      <div className="border border-border-strong bg-canvas focus-within:border-accent">
        <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
          <ToolbarButton
            label="Pogrubienie"
            isActive={editor?.isActive("bold")}
            onPress={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Kursywa"
            isActive={editor?.isActive("italic")}
            onPress={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Lista wypunktowana"
            isActive={editor?.isActive("bulletList")}
            onPress={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Lista numerowana"
            isActive={editor?.isActive("orderedList")}
            onPress={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-4" />
          </ToolbarButton>
          <ToolbarButton label="Link" isActive={editor?.isActive("link")} onPress={setLink}>
            <LinkIcon className="size-4" />
          </ToolbarButton>
        </div>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} />
    </div>
  );
};
