#!/bin/bash

> database/database.sqlite
php artisan migrate --force
php artisan tinker --execute="App\Models\User::create(['name' => 'aa', 'email' => 'aa@g.com', 'password' => bcrypt('pwd')])"
php artisan migrate:fresh --seed
