# Learning Materials Review Platform

This repository contains the source code for our web-based platform that allows users to discover, review, and rate learning materials (YouTube tutorials and textbooks). 

The application is built with a decoupled architecture: a **Laravel 11** backend API and a **React/TypeScript (Vite)** frontend.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* **PHP** (v8.3+)
* **Composer**
* **Node.js** (v20+)
* **pnpm** (Package manager)
* **Git**

---

## Local Setup Instructions

Follow these steps to configure your local development environment after cloning the repository.

### 1. Install Dependencies
Download all required packages for both the frontend and backend:
```bash
pnpm install
composer install
```

### 2. Configure Environment Variables
Create your local environment file and generate a unique application security key:
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Setup the Local Database
We use SQLite for local development. Create the database file and run the migrations to build the tables:
```bash
touch database/database.sqlite
php artisan migrate
```

### 4. Create the Admin User
Run this command to create a dummy administrator account so you can access the Filament admin dashboard immediately:
```bash
php artisan tinker --execute="App\Models\User::create(['name' => 'aa', 'email' => 'aa@g.com', 'password' => bcrypt('pwd')])"
php artisan migrate:fresh --seed
```

---

## Starting the Application

Because this project uses a Laravel backend and a Vite-powered React frontend, you need to run two separate development servers simultaneously. 

Open **two separate terminal windows** at the root of the project.

**Terminal 1: Start the Backend (Laravel)**
```bash
php artisan serve
```
*This will start the PHP server at `http://localhost:8000`.*

**Terminal 2: Start the Frontend (React/Vite)**
```bash
pnpm run dev
```
*This will start the Vite development server and watch your frontend files for changes.*

---

## Important URLs

Once both servers are running, you can access the following environments:

* **API Documentation (Swagger):** `http://localhost:8000/api/documentation`
* **Admin Dashboard:** `http://localhost:8000/admin/dashboard`
    * **Email:** `aa@g.com`
    * **Password:** `pwd`
 
## Other Important Resources
* **In Depth API Documentation:** `https://deepwiki.com/emphs/p3975/2.1-learning-resources-api`
* **Presentation:** `https://docs.google.com/presentation/d/19f7jbq-u17pZVQQzdK5xJf3fZi6vB-J9Ld4sF2X-124/edit?usp=sharing`
