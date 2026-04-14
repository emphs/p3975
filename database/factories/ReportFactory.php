<?php

namespace Database\Factories;

use App\Models\LearningResource;
use App\Models\Report;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'learning_resource_id' => LearningResource::factory(),
            'review_id' => Review::factory(),
            'reason' => $this->faker->sentence(),
            'status' => 'pending',
        ];
    }
}
