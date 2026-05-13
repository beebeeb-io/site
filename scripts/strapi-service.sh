#!/usr/bin/env bash
# Manage Strapi as a background process on Plesk
# Usage: ./strapi-service.sh {start|stop|status|logs}
#
# This runs Strapi via nohup since Plesk's Node.js handler
# only manages the main site app. Strapi listens on localhost:1337.

CMS_DIR="$HOME/httpdocs/cms"
PID_FILE="$CMS_DIR/.strapi.pid"
LOG_FILE="$CMS_DIR/.strapi.log"

NODE_DIR="$HOME/.nodenv/versions/22"
export PATH="$NODE_DIR/bin:$PATH"

case "${1:-}" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Strapi already running (PID $(cat "$PID_FILE"))"
      exit 0
    fi
    echo "Starting Strapi..."
    cd "$CMS_DIR"
    NODE_ENV=production nohup node node_modules/.bin/strapi start >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    sleep 3
    if kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Strapi started (PID $(cat "$PID_FILE")), listening on localhost:1337"
    else
      echo "ERROR: Strapi failed to start. Check $LOG_FILE"
      exit 1
    fi
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping Strapi (PID $PID)..."
        kill "$PID"
        rm -f "$PID_FILE"
        echo "Stopped."
      else
        echo "PID $PID not running. Cleaning up."
        rm -f "$PID_FILE"
      fi
    else
      echo "No PID file found. Strapi not running."
    fi
    ;;
  restart)
    "$0" stop
    sleep 2
    "$0" start
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Strapi running (PID $(cat "$PID_FILE"))"
      curl -s http://127.0.0.1:1337/_health && echo " - healthy" || echo " - not responding"
    else
      echo "Strapi not running"
    fi
    ;;
  logs)
    tail -50 "$LOG_FILE"
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs}"
    exit 1
    ;;
esac
