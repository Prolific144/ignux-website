#!/bin/bash
# run.sh

# Set environment variables
export DATABASE_URL="sqlite:///./ignux.db"
export SMTP_USERNAME="your_email@gmail.com"
export SMTP_PASSWORD="your_app_password"
export EMAIL_FROM="noreply@ignux.com"

# Run the application
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000