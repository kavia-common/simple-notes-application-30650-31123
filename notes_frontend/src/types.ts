export type Note = {
  id: number;
  title: string;
  content: string;
  updated_at: string; // ISO
};

export type NoteCreate = {
  title: string;
  content?: string;
};

export type NoteUpdate = {
  title?: string;
  content?: string;
};
