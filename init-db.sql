-- IP Tracker Database Initialization Script
-- This script will be executed when the PostgreSQL container starts for the first time

-- Create the database (if not exists)
CREATE DATABASE IF NOT EXISTS iptracker;

-- Connect to the iptracker database
\c iptracker;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE iptracker TO postgres;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: The actual table creation will be handled by Drizzle ORM
-- when the application starts and runs database migrations