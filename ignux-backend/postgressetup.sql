-- Drop existing database and user (optional!)
DROP DATABASE IF EXISTS ignux_db;
DROP USER IF EXISTS ignux_user;

-- Create database and user
CREATE DATABASE ignux_db;
CREATE USER ignux_user WITH PASSWORD 'Slevinon144006!';

-- Configure user defaults
ALTER ROLE ignux_user SET client_encoding TO 'utf8';
ALTER ROLE ignux_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ignux_user SET timezone TO 'Africa/Nairobi';

-- Grant privileges on the database
GRANT ALL PRIVILEGES ON DATABASE ignux_db TO ignux_user;

-- Connect to the new database
\c ignux_db

-- Grant schema-level privileges
GRANT ALL ON SCHEMA public TO ignux_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO ignux_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ignux_user;

-- Set default privileges for future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON TABLES TO ignux_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON SEQUENCES TO ignux_user;
