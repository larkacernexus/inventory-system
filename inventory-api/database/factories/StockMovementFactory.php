<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['in', 'out', 'adjustment']);

        return [
            'product_id' => Product::factory(),
            'user_id'    => User::factory(),
            'type'       => $type,
            'quantity'   => fake()->numberBetween(1, 50),
            'reference'  => strtoupper($type) . '-' . strtoupper(fake()->bothify('??####')),
            'notes'      => fake()->optional(0.6)->sentence(),
            'created_at' => fake()->dateTimeBetween('-60 days', 'now'),
        ];
    }

    public function stockIn(): static
    {
        return $this->state(fn () => [
            'type'      => 'in',
            'reference' => 'PO-' . strtoupper(fake()->bothify('####')),
        ]);
    }

    public function stockOut(): static
    {
        return $this->state(fn () => [
            'type'      => 'out',
            'reference' => 'SO-' . strtoupper(fake()->bothify('####')),
        ]);
    }

    public function adjustment(): static
    {
        return $this->state(fn () => [
            'type'      => 'adjustment',
            'reference' => 'ADJ-' . strtoupper(fake()->bothify('####')),
        ]);
    }
}