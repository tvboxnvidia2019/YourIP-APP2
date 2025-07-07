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
- 💾 SQLite database storage

## Quick Start

### Development

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5000`

The application will automatically:
- Create a SQLite database file (`data/iptracker.db`)
- Set up the required database tables
- Start serving on port 5000

### Production Deployment on Replit

This application is optimized for deployment on Replit:

1. Import this repository into a new Repl
2. The application will automatically install dependencies and start
3. Access your deployed application via the Replit-provided URL

**Replit Deployment Features:**
- Automatic dependency installation
- Built-in SQLite database support
- Zero-configuration deployment
- Persistent storage for database files

### Environment Variables

No environment variables are required for basic operation. The application uses SQLite with local file storage.

Optional environment variables:
- `NODE_ENV`: Set to `production` for production mode (default: `development`)
- `PORT`: Application port (default: 5000)

### Database Setup

The application uses SQLite for data storage. The database file is automatically created when the application starts. No additional setup is required.

### Database Migrations (Drizzle ORM)

If you change the database schema (in `shared/schema.ts`), generate and apply migrations using Drizzle ORM:

```bash
# Generate a new migration based on schema changes
npx drizzle-kit generate

# Push (apply) all migrations to the database
npm run db:push
```

- `npx drizzle-kit generate` creates a new migration file in the `migrations` folder.
- `npm run db:push` applies all migrations to your SQLite database.

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/            # Utilities and query client
├── server/                 # Express backend
│   ├── db.ts              # Database configuration
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schema
│   └── schema.ts          # Database schema
├── migrations/             # Database migrations
└── data/                   # SQLite database files
```

### API Endpoints

- `GET /api/ip-info` - Get current IP information
- `GET /api/recent-lookups` - Get recent IP lookup history

### Troubleshooting

**Database Issues:**
- If you see "no such table" errors, the database migration failed
- Delete the `data/` folder and restart the application to recreate tables
- Check that the `migrations/` folder contains the required migration files

**Port Issues:**
- The application runs on port 5000 by default
- Ensure no other applications are using port 5000
- On Replit, the port is automatically handled

**Build Issues:**
- Run `npm install` to ensure all dependencies are installed
- Clear the `node_modules` folder and reinstall if needed

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with Drizzle ORM
- **Build**: Vite (frontend), esbuild (backend)

## License

MIT License