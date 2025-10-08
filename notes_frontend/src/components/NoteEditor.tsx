import React, { useEffect, useState } from "react";
import { Note } from "../types";

type Props = {
  note: Note;
  onSave: (update: { id: number; title: string; content: string }) => void;
  onDelete: () => void;
};

export default function NoteEditor({ note, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content ?? "");
  const [saving, setSaving] = useState(false);

  // sync when note changes (switching)
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content ?? "");
  }, [note.id]);

  async function handleSave() {
    setSaving(true);
    await Promise.resolve(onSave({ id: note.id, title: title.trim(), content }));
    setSaving(false);
  }

  return (
    <>
      <input
        className="title-input"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
      />
      <textarea
        className="content-input"
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSave}
      />
      <div className="toolbar">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </>
  );
}
