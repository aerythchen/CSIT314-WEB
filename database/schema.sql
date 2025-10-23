-- PostgreSQL Database Schema for CSR Volunteering Platform
-- Run this in pgAdmin or psql to create all tables

-- Create database (run this first)
-- CREATE DATABASE csr_volunteering_platform;

-- Connect to the database and run the following:

-- User Profiles Table
CREATE TABLE IF NOT EXISTS userProfiles (
    id VARCHAR(255) PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userType VARCHAR(50) NOT NULL CHECK (userType IN ('csrrepresentative', 'personinneed', 'platformmanager', 'useradmin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    adminnotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

-- User Accounts Table
CREATE TABLE IF NOT EXISTS userAccounts (
    id VARCHAR(255) PRIMARY KEY,
    profileId VARCHAR(255) NOT NULL REFERENCES userProfiles(id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive', 'locked')),
    lastLogin TIMESTAMP,
    loginAttempts INTEGER DEFAULT 0,
    forcepasswordreset BOOLEAN DEFAULT FALSE,
    accountlocked BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    requestCount INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
    id VARCHAR(255) PRIMARY KEY,
    createdBy VARCHAR(255) NOT NULL REFERENCES userProfiles(id) ON DELETE CASCADE,
    createdByName VARCHAR(255) NOT NULL,
    categoryId VARCHAR(255) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    categoryName VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    urgency VARCHAR(50) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    viewcount INTEGER DEFAULT 0,
    shortlistcount INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

-- Shortlists Table
CREATE TABLE IF NOT EXISTS shortlists (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL REFERENCES userProfiles(id) ON DELETE CASCADE,
    requestId VARCHAR(255) NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL REFERENCES userProfiles(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(255) PRIMARY KEY,
    requestId VARCHAR(255) NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    csrId VARCHAR(255) NOT NULL REFERENCES userProfiles(id) ON DELETE CASCADE,
    serviceType VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    completedAt TIMESTAMP,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);


-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_userProfiles_email ON userProfiles(email);
CREATE INDEX IF NOT EXISTS idx_userProfiles_userType ON userProfiles(userType);
CREATE INDEX IF NOT EXISTS idx_userAccounts_profileId ON userAccounts(profileId);
CREATE INDEX IF NOT EXISTS idx_requests_createdBy ON requests(createdBy);
CREATE INDEX IF NOT EXISTS idx_requests_categoryId ON requests(categoryId);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions(userId);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_matches_requestId ON matches(requestId);
CREATE INDEX IF NOT EXISTS idx_matches_csrId ON matches(csrId);

-- Create function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_userProfiles_updated_at BEFORE UPDATE ON userProfiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_userAccounts_updated_at BEFORE UPDATE ON userAccounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shortlists_updated_at BEFORE UPDATE ON shortlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
