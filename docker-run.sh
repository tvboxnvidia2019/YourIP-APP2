
#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t ip-tracker .

# Run the container
echo "Starting container..."
docker run -d \
  --name ip-tracker-app \
  -p 5000:5000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  ip-tracker

echo "IP Tracker application is running at http://localhost:5000"
echo "To stop: docker stop ip-tracker-app"
echo "To remove: docker rm ip-tracker-app"
