# Notes Frontend (React + TypeScript)

A modern, minimal UI for the Simple Notes app using the Ocean Professional theme.

- Port: 3000
- Talks to backend at REACT_APP_API_BASE (default http://localhost:3001)

## Install

```
npm install
```

## Run

```
npm start
```

Open http://localhost:3000

## Environment

Copy `.env.example` to `.env` to customize:

```
REACT_APP_API_BASE=http://localhost:3001
```

## Features

- Sidebar with searchable list of notes
- Editor panel with auto-save on blur and explicit Save
- Create/Delete notes with optimistic updates
- Theming via CSS variables (Ocean Professional)
