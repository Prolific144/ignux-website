#!/bin/bash
BACKUP_DIR="/var/backups/ignux"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -U postgres ignux_db > "$BACKUP_DIR/db_$DATE.sql"
gzip "$BACKUP_DIR/db_$DATE.sql"

# Uploads backup
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /var/www/ignux/uploads/

# Keep only last 7 days of backups
find "$BACKUP_DIR" -type f -mtime +7 -delete