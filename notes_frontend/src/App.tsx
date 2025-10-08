import React, { useEffect, useMemo, useState } from "react";
import TopNav from "./components/TopNav";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import { Note } from "./types";
import { api } from "./lib/api";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const filteredNotes = useMemo(() => {
    const q = filter.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.content ?? "").toLowerCase().includes(q)
    );
  }, [notes, filter]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await api.listNotes();
        if (mounted) setNotes(data);
      } catch (e) {
        setToast("Failed to load notes");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  async function handleCreate() {
    try {
      const created = await api.createNote({
        title: "Untitled",
        content: ""
      });
      setNotes((prev) => [created, ...prev]);
      setSelectedId(created.id);
    } catch {
      setToast("Failed to create note");
    }
  }

  async function handleDelete(id: number) {
    const prev = [...notes];
    setNotes((ns) => ns.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      await api.deleteNote(id);
    } catch {
      setToast("Failed to delete note");
      // revert optimistic change
      setNotes(prev);
    }
  }

  async function handleSave(update: { id: number; title: string; content: string }) {
    // optimistic update
    const prev = [...notes];
    setNotes((ns) =>
      ns.map((n) => (n.id === update.id ? { ...n, ...update, updated_at: new Date().toISOString() } : n))
    );
    try {
      const saved = await api.updateNote(update.id, { title: update.title, content: update.content });
      setNotes((ns) => ns.map((n) => (n.id === saved.id ? saved : n)));
    } catch {
      setToast("Failed to save note");
      setNotes(prev);
    }
  }

  return (
    <div className="app-container">
      <TopNav />
      <div className="main">
        <div className="card sidebar">
          <input
            className="search"
            placeholder="Search notes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="note-list">
            {loading ? (
              <div className="empty">Loading...</div>
            ) : filteredNotes.length === 0 ? (
              <div className="empty">No notes found.</div>
            ) : (
              <NotesList
                notes={filteredNotes}
                activeId={selectedId}
                onSelect={setSelectedId}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
        <div className="card editor">
          {selectedNote ? (
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onSave={handleSave}
              onDelete={() => handleDelete(selectedNote.id)}
            />
          ) : (
            <div className="empty">Select a note to view or edit.</div>
          )}
        </div>
      </div>

      <button className="fab" aria-label="New note" onClick={handleCreate}>
        +
      </button>

      {toast && (
        <div className="toast" onAnimationEnd={() => setToast(null)}>
          {toast}
        </div>
      )}
    </div>
  );
}
