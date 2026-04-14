<?php

namespace Database\Factories;

use App\Models\LearningResource;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LearningResource>
 */
class LearningResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['youtube', 'textbook']);

        return [
            'type' => $type,
            'identifier' => $type === 'youtube'
                ? 'https://www.youtube.com/watch?v=' . $this->faker->regexify('[A-Za-z0-9_-]{11}')
                : $this->faker->isbn13(),
            'title' => $this->faker->sentence(),
            'author' => $type === 'textbook' ? $this->faker->name() : null,
            'cover_image_url' => $type === 'textbook' ? $this->faker->imageUrl() : null,
            'ai_summary' => $this->faker->paragraph(),
        ];
    }
}
