# Your IP - IP Address Tracker

A modern web application that displays comprehensive IP address information including geolocation, ISP details, and security analysis.

## Features

- 🌍 IPv4 and IPv6 address detection
- 📍 Geographic location information
- 🏢 ISP and network provider details
- 🔒 Security status and threat analysis
- 📊 IP lookup history tracking
- 🌙 Dark mode support
- 📱 Responsive design
- 💾 PostgreSQL database storage

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your system

### Quick Start with Docker Compose

1. Clone or download this repository
2. Navigate to the project directory
3. Run the application:

```bash
docker-compose up -d
```

This will:
- Build the application container
- Start a PostgreSQL database
- Set up the database schema automatically
- Run the application on http://localhost:5000

### Manual Docker Build

If you prefer to build and run manually:

```bash
# Build the image
docker build -t your-ip-tracker .

# Run with external database
docker run -p 5000:5000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/database" \
  your-ip-tracker
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to "production" for production deployment
- `PORT`: Application port (default: 5000)

### Database Setup

The application uses PostgreSQL. When using Docker Compose, the database is automatically configured. For manual setup:

1. Create a PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run the application - it will automatically create the required tables

### Production Deployment

For production deployment:

1. Update the `docker-compose.yml` with secure passwords
2. Consider using Docker secrets for sensitive data
3. Set up proper networking and reverse proxy (nginx/traefik)
4. Configure SSL/TLS certificates
5. Set up backup strategies for the PostgreSQL volume

### Development

To run in development mode:

```bash
npm install
npm run dev
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build**: Vite (frontend), esbuild (backend)

## API Endpoints

- `GET /api/ip-info` - Get current IP information
- `GET /api/recent-lookups` - Get recent IP lookup history

## License

MIT License