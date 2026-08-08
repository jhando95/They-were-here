#!/bin/bash
# THEY WERE HERE — local launcher for macOS.
# Double-click to host the Field Kit on your Mac (no internet, no GitHub).
# First time: right-click → Open (Gatekeeper asks once for downloaded scripts).
cd "$(dirname "$0")"
PORT=8247   # of course it is

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 not found — opening the app straight from the files instead."
  open "index.html"
  exit 0
fi

( sleep 1; open "http://localhost:$PORT" ) &
echo ""
echo "  PINEBROOK FIELD KIT — http://localhost:$PORT"
echo "  Keep this window open while you play. Close it (or press Ctrl+C) to stop."
echo ""
python3 -m http.server $PORT
