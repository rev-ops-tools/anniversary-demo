<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BenchmarkRun>
 */
class BenchmarkRunFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $avgMs = fake()->randomFloat(2, 1, 50);

        return [
            'run_type' => fake()->randomElement(['octane', 'standard']),
            'request_count' => fake()->numberBetween(10, 500),
            'avg_ms' => $avgMs,
            'min_ms' => $avgMs * 0.5,
            'max_ms' => $avgMs * 3,
            'p95_ms' => $avgMs * 2,
            'median_ms' => $avgMs * 0.9,
            'total_ms' => $avgMs * 100,
            'metadata' => null,
        ];
    }

    /**
     * State for octane runs.
     */
    public function octane(): static
    {
        return $this->state(fn (array $attributes) => [
            'run_type' => 'octane',
        ]);
    }

    /**
     * State for standard runs.
     */
    public function standard(): static
    {
        return $this->state(fn (array $attributes) => [
            'run_type' => 'standard',
        ]);
    }
}
