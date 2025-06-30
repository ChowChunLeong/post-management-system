# Post Management System

A comprehensive post management system built with modern web technologies.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- pnpm package manager
- MySQL database server
- Git

## Installation & Setup

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/ChowChunLeong/post-management-system
cd post-management-system
```

### 2. Environment Configuration

Create a `.env` file in the root folder with the following database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=my-secret-pw
DB_DATABASE=post_management_system

# JWT Configuration
JWT_SECRET=JWT_SECRET
JWT_EXPIRES_IN=3600s

# TypeORM Configuration
TYPEORM_SYNC=true
```

> **Note:** Make sure to replace the database credentials with your actual MySQL configuration.

### 3. Database Setup

Create the database schema in your MySQL server:

```sql
CREATE SCHEMA post_management_system;
```

### 4. Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 5. Start the Application

Run the development server:

```bash
pnpm run start
```

The application will start and be available at `http://localhost:3000`

## API Documentation

Once the application is running, you can access the API documentation at:

```
http://localhost:3000/api
```

## Default Admin Credentials

The system comes with a default admin user for initial access:

- **Username:** `admin`
- **Password:** `password`
