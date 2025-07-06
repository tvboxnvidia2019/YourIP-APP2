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

### Production Build Process

The application uses a custom build process optimized for Docker production deployment:

1. **Frontend**: Creates a minimal production HTML file with essential IP tracking functionality
2. **Backend**: Builds a standalone server bundle using esbuild, excluding development dependencies
3. **Static Files**: Serves the frontend from `/dist/public` directory
4. **Database**: Automatically connects to PostgreSQL and creates required tables

The production build is optimized for fast deployment and minimal container size.

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

### Troubleshooting

**Docker Build Issues:**
- If you encounter "Cannot find package 'vite'" errors, the build process has been optimized to avoid this issue
- The production build uses a custom script (`build-docker.js`) that creates optimized bundles without development dependencies

**Database Connection:**
- Ensure the PostgreSQL container is running before starting the app container
- Check the `DATABASE_URL` environment variable format: `postgresql://user:password@host:5432/database`
- The application will automatically create database tables on first run

**Port Conflicts:**
- The application runs on port 5000 by default
- If port 5000 is already in use, modify the port mapping in `docker-compose.yml`

**Build Performance:**
- The production build is optimized for Docker and avoids slow frontend builds
- Build time is typically under 2 minutes for most systems

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