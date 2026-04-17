# Learning Materials Review Platform

This repository contains the source code for our web-based platform that allows users to discover, review, and rate learning materials. 

The application is built with a decoupled architecture: a **Laravel 11** backend API and a **React/TypeScript (Vite)** frontend.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* **PHP** (v8.3+)
* **Composer**
* **Node.js** (v20+)
* **pnpm/npm** 
* **Git**

---

## Local Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
composer install
```

### 2. Configure Keys and Environment Variables
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Setup the Local Database
```bash
touch database/database.sqlite
php artisan migrate
```

### 4. Create the Admin User
```bash
php artisan tinker --execute="App\Models\User::create(['name' => 'aa', 'email' => 'aa@g.com', 'password' => bcrypt('pwd')])"
php artisan migrate:fresh --seed
```

---

## Starting the Application

Laravel and a Vite+React need to run in two separate terminal. 

**Terminal 1: Start the Backend (Laravel)**
```bash
php artisan serve
```
**Terminal 2: Start the Frontend (React/Vite)**
```bash
pnpm run dev
```
---

## Important URLs
* **API Documentation (Swagger):** `http://localhost:8000/api/documentation`
* **Admin Dashboard:** `http://localhost:8000/admin/dashboard`
    * **Email:** `aa@g.com`
    * **Password:** `pwd`
 
## Resources
* **Project Documentation:** `https://deepwiki.com/emphs/p3975/2.1-learning-resources-api`
* **Presentation:** `https://docs.google.com/presentation/d/19f7jbq-u17pZVQQzdK5xJf3fZi6vB-J9Ld4sF2X-124/edit?usp=sharing`
