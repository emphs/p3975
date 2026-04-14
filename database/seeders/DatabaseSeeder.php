<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create the Admin User with the is_admin flag set to true
        \App\Models\User::factory()->create([
            'name' => 'aa',
            'email' => 'aa@g.com',
            'password' => bcrypt('pwd'),
            'is_admin' => true,
        ]);

        $this->call([
            LearningResourceSeeder::class,
            ReportSeeder::class,
        ]);
    }
}
