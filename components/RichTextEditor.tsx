import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
  name: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, id, name }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link'],
            ['clean']
          ]
        }
      });

      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });

      quillRef.current = quill;
    }
  }, [onChange]);

  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      const currentSelection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value;
      if (currentSelection) {
        // Restore cursor position after update
        setTimeout(() => quillRef.current?.setSelection(currentSelection), 1);
      }
    }
  }, [value]);

  return (
    <div className="mt-1 bg-white">
      <div ref={editorRef} id={id} />
      {/* Hidden textarea to hold the value for form submission if needed, though we handle it via state */}
      <textarea name={name} value={value} readOnly style={{ display: 'none' }} />
    </div>
  );
};

export default RichTextEditor;