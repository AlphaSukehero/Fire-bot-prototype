#!/bin/bash
# Source profile to ensure npm and node are in PATH for non-interactive shells
if [ -f ~/.nvm/nvm.sh ]; then
  source ~/.nvm/nvm.sh
elif [ -f ~/.bashrc ]; then
  source ~/.bashrc
fi

cd "/home/alpha/Desktop/My website/Fire bot prototype/anti gravity" || exit

if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
  npm run dev > server.log 2>&1 &
  sleep 3
fi

xdg-open http://localhost:3000
