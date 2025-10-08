import React from "react";
import { Note } from "../types";

type Props = {
  notes: Note[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
};

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function NotesList({ notes, activeId, onSelect, onDelete }: Props) {
  return (
    <>
      {notes.map((n) => (
        <div
          key={n.id}
          className={`note-item ${activeId === n.id ? "active" : ""}`}
          onClick={() => onSelect(n.id)}
        >
          <div className="note-title">{n.title || "Untitled"}</div>
          <div className="note-updated">Updated: {formatTime(n.updated_at)}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(n.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
