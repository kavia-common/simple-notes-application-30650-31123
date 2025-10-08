#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-notes-application-30650-31123/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

