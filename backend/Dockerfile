FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing .pyc files and set buffer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies if any are needed (curl, build-essential, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy codebase
COPY . .

# Expose port and start via uvicorn
ENV PORT=8080
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT
