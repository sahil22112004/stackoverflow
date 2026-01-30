// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// const Tiptap = ({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (val: string) => void;
// }) => {
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: value || "<p></p>",
//     immediatelyRender: false,
//     onUpdate({ editor }) {
//       onChange(editor.getHTML());
//     },
//   });

//   return (
//     <EditorContent editor={editor}  />
//   );
// };

// export default Tiptap;
