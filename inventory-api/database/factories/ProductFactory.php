<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Realistic product name pool per category keyword.
     */
    protected array $brands = [
        'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer',
        'Logitech', 'Anker', 'Bose', 'Canon', 'Nikon', 'Google', 'Microsoft',
        'Xiaomi', 'OnePlus', 'Razer', 'Corsair', 'Kingston', 'Seagate',
    ];

    protected array $productTypes = [
        'Pro', 'Air', 'Ultra', 'Max', 'Plus', 'Lite', 'Mini', 'Edge',
        'Studio', 'Elite', 'Prime', 'Neo', 'Plus', 'X', 'Z',
    ];

    protected array $items = [
        'Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Earbuds', 'Speaker',
        'Monitor', 'Keyboard', 'Mouse', 'Webcam', 'Router', 'Charger',
        'Power Bank', 'SSD Drive', 'External HDD', 'USB Hub', 'Camera',
        'Printer', 'Scanner', 'Smartwatch', 'Fitness Tracker', 'Air Fryer',
        'Coffee Maker', 'Blender', 'Vacuum Cleaner',
    ];

    public function definition(): array
    {
        $brand = fake()->randomElement($this->brands);
        $item = fake()->randomElement($this->items);
        $type = fake()->randomElement($this->productTypes);
        $name = "{$brand} {$item} {$type}";

        $price = $this->priceForItem($item);
        $quantity = fake()->numberBetween(0, 200);
        $reorder = fake()->numberBetween(5, 30);

        return [
            'sku'           => $this->makeSku($item),
            'name'          => $name,
            'description'   => "The {$name} is a premium {$item} designed for everyday use. " . fake()->sentence(10),
            'category_id'   => Category::factory(),
            'price'         => $price,
            'quantity'      => $quantity,
            'reorder_level' => $reorder,
            'image'         => null,
        ];
    }

    public function lowStock(): static
    {
        return $this->state(fn () => [
            'quantity'      => fake()->numberBetween(0, 5),
            'reorder_level' => 10,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => [
            'quantity' => 0,
        ]);
    }

    /**
     * Build a realistic SKU based on the item type.
     */
    protected function makeSku(string $item): string
    {
        $prefix = match (true) {
            str_contains($item, 'Laptop'),
            str_contains($item, 'Monitor'),
            str_contains($item, 'Keyboard'),
            str_contains($item, 'Mouse'),
            str_contains($item, 'Webcam'),
            str_contains($item, 'SSD'),
            str_contains($item, 'HDD'),
            str_contains($item, 'USB')      => 'COM',
            str_contains($item, 'Smartphone'),
            str_contains($item, 'Tablet')   => 'MOB',
            str_contains($item, 'Headphones'),
            str_contains($item, 'Earbuds'),
            str_contains($item, 'Speaker')  => 'AUD',
            str_contains($item, 'Camera')   => 'CAM',
            str_contains($item, 'Router')   => 'NET',
            str_contains($item, 'Charger'),
            str_contains($item, 'Power')    => 'PWR',
            str_contains($item, 'Printer'),
            str_contains($item, 'Scanner')  => 'OFF',
            str_contains($item, 'Smartwatch'),
            str_contains($item, 'Fitness')  => 'WEA',
            default                          => 'GEN',
        };

        return $prefix . '-' . fake()->unique()->numberBetween(1000, 9999);
    }

    /**
     * Return a price range appropriate to the item.
     */
    protected function priceForItem(string $item): float
    {
        [$min, $max] = match (true) {
            str_contains($item, 'Laptop'),
            str_contains($item, 'Monitor')   => [400, 3000],
            str_contains($item, 'Smartphone'),
            str_contains($item, 'Tablet')    => [200, 1500],
            str_contains($item, 'Camera')    => [300, 2500],
            str_contains($item, 'Headphones'),
            str_contains($item, 'Speaker'),
            str_contains($item, 'Earbuds')   => [30, 500],
            str_contains($item, 'Router')    => [40, 600],
            str_contains($item, 'Printer'),
            str_contains($item, 'Scanner')   => [80, 400],
            str_contains($item, 'Smartwatch'),
            str_contains($item, 'Fitness')   => [50, 900],
            str_contains($item, 'Air Fryer'),
            str_contains($item, 'Coffee'),
            str_contains($item, 'Blender'),
            str_contains($item, 'Vacuum')    => [40, 800],
            default                          => [10, 200],
        };

        return round(fake()->randomFloat(2, $min, $max), 2);
    }
}