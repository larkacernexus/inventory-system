<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================================
        // === Fixed accounts ======================================
        // =========================================================
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // =========================================================
        // === Additional random users =============================
        // =========================================================
        User::factory()->admin()->count(2)->create();
        User::factory()->manager()->count(3)->create();
        User::factory()->staff()->count(10)->create();
        User::factory()->inactive()->count(2)->create();

        // =========================================================
        // === Categories (real-world names) =======================
        // =========================================================
        $categoryData = [
            ['name' => 'Laptops & Computers',      'description' => 'Desktop computers, laptops, and workstation hardware.'],
            ['name' => 'Smartphones & Tablets',    'description' => 'Mobile phones, tablets, and accessories.'],
            ['name' => 'Audio & Headphones',       'description' => 'Headphones, earbuds, speakers, and audio equipment.'],
            ['name' => 'Cameras & Photography',    'description' => 'DSLR, mirrorless cameras, lenses, and photography gear.'],
            ['name' => 'Gaming & Consoles',        'description' => 'Gaming consoles, controllers, and accessories.'],
            ['name' => 'Home Appliances',          'description' => 'Kitchen and household electrical appliances.'],
            ['name' => 'Wearables & Smart Devices','description' => 'Smartwatches, fitness trackers, and IoT devices.'],
            ['name' => 'Networking Equipment',     'description' => 'Routers, switches, modems, and network accessories.'],
            ['name' => 'Office Supplies',          'description' => 'Stationery, printers, and general office essentials.'],
            ['name' => 'Accessories & Cables',     'description' => 'Chargers, cables, cases, and misc. accessories.'],
        ];

        $categories = collect($categoryData)->map(
            fn ($data) => Category::create($data)
        );

        // =========================================================
        // === Real product catalog ================================
        // =========================================================
        $catalog = [
            'Laptops & Computers' => [
                ['sku' => 'LAP-1001', 'name' => 'MacBook Pro 14" M3',         'price' => 1999.00, 'qty' => 24, 'reorder' => 5],
                ['sku' => 'LAP-1002', 'name' => 'Dell XPS 15',                'price' => 1799.00, 'qty' => 18, 'reorder' => 5],
                ['sku' => 'LAP-1003', 'name' => 'Lenovo ThinkPad X1 Carbon',  'price' => 1649.00, 'qty' => 12, 'reorder' => 5],
                ['sku' => 'LAP-1004', 'name' => 'HP Spectre x360',            'price' => 1449.00, 'qty' => 9,  'reorder' => 5],
                ['sku' => 'LAP-1005', 'name' => 'ASUS ROG Zephyrus G14',      'price' => 1599.00, 'qty' => 7,  'reorder' => 5],
                ['sku' => 'LAP-1006', 'name' => 'Apple iMac 24"',             'price' => 1299.00, 'qty' => 15, 'reorder' => 4],
                ['sku' => 'LAP-1007', 'name' => 'Acer Aspire 5',              'price' => 549.00,  'qty' => 3,  'reorder' => 10],
                ['sku' => 'LAP-1008', 'name' => 'Microsoft Surface Laptop 5', 'price' => 1199.00, 'qty' => 0,  'reorder' => 5],
            ],
            'Smartphones & Tablets' => [
                ['sku' => 'PHN-2001', 'name' => 'iPhone 15 Pro Max',          'price' => 1199.00, 'qty' => 42, 'reorder' => 10],
                ['sku' => 'PHN-2002', 'name' => 'Samsung Galaxy S24 Ultra',   'price' => 1299.00, 'qty' => 35, 'reorder' => 10],
                ['sku' => 'PHN-2003', 'name' => 'Google Pixel 8 Pro',         'price' => 999.00,  'qty' => 28, 'reorder' => 10],
                ['sku' => 'PHN-2004', 'name' => 'OnePlus 12',                 'price' => 799.00,  'qty' => 20, 'reorder' => 8],
                ['sku' => 'TAB-2005', 'name' => 'iPad Pro 12.9" M2',          'price' => 1099.00, 'qty' => 22, 'reorder' => 5],
                ['sku' => 'TAB-2006', 'name' => 'Samsung Galaxy Tab S9',      'price' => 849.00,  'qty' => 16, 'reorder' => 5],
                ['sku' => 'TAB-2007', 'name' => 'Microsoft Surface Pro 9',    'price' => 999.00,  'qty' => 4,  'reorder' => 8],
                ['sku' => 'PHN-2008', 'name' => 'Xiaomi 14 Ultra',            'price' => 899.00,  'qty' => 0,  'reorder' => 5],
            ],
            'Audio & Headphones' => [
                ['sku' => 'AUD-3001', 'name' => 'Sony WH-1000XM5',            'price' => 399.00,  'qty' => 55, 'reorder' => 10],
                ['sku' => 'AUD-3002', 'name' => 'Apple AirPods Pro 2',        'price' => 249.00,  'qty' => 88, 'reorder' => 15],
                ['sku' => 'AUD-3003', 'name' => 'Bose QuietComfort Ultra',    'price' => 429.00,  'qty' => 30, 'reorder' => 10],
                ['sku' => 'AUD-3004', 'name' => 'Sennheiser Momentum 4',      'price' => 349.00,  'qty' => 18, 'reorder' => 8],
                ['sku' => 'AUD-3005', 'name' => 'JBL Flip 6 Speaker',         'price' => 129.00,  'qty' => 65, 'reorder' => 20],
                ['sku' => 'AUD-3006', 'name' => 'Sonos Era 300',              'price' => 449.00,  'qty' => 2,  'reorder' => 5],
            ],
            'Cameras & Photography' => [
                ['sku' => 'CAM-4001', 'name' => 'Canon EOS R6 Mark II',       'price' => 2499.00, 'qty' => 8,  'reorder' => 3],
                ['sku' => 'CAM-4002', 'name' => 'Sony Alpha A7 IV',           'price' => 2499.00, 'qty' => 10, 'reorder' => 3],
                ['sku' => 'CAM-4003', 'name' => 'Nikon Z6 II',                'price' => 1999.00, 'qty' => 6,  'reorder' => 3],
                ['sku' => 'CAM-4004', 'name' => 'Fujifilm X-T5',              'price' => 1699.00, 'qty' => 12, 'reorder' => 4],
                ['sku' => 'CAM-4005', 'name' => 'GoPro HERO 12 Black',        'price' => 399.00,  'qty' => 25, 'reorder' => 10],
                ['sku' => 'CAM-4006', 'name' => 'DJI Osmo Pocket 3',          'price' => 519.00,  'qty' => 0,  'reorder' => 5],
            ],
            'Gaming & Consoles' => [
                ['sku' => 'GAM-5001', 'name' => 'PlayStation 5 Slim',         'price' => 499.00,  'qty' => 20, 'reorder' => 5],
                ['sku' => 'GAM-5002', 'name' => 'Xbox Series X',              'price' => 499.00,  'qty' => 15, 'reorder' => 5],
                ['sku' => 'GAM-5003', 'name' => 'Nintendo Switch OLED',       'price' => 349.00,  'qty' => 32, 'reorder' => 8],
                ['sku' => 'GAM-5004', 'name' => 'Steam Deck OLED',            'price' => 549.00,  'qty' => 4,  'reorder' => 5],
                ['sku' => 'GAM-5005', 'name' => 'DualSense Wireless Controller', 'price' => 69.00, 'qty' => 60, 'reorder' => 20],
                ['sku' => 'GAM-5006', 'name' => 'Logitech G Pro X Superlight', 'price' => 149.00, 'qty' => 45, 'reorder' => 15],
            ],
            'Home Appliances' => [
                ['sku' => 'HOM-6001', 'name' => 'Dyson V15 Detect Vacuum',    'price' => 749.00,  'qty' => 14, 'reorder' => 5],
                ['sku' => 'HOM-6002', 'name' => 'Instant Pot Duo 7-in-1',     'price' => 99.00,   'qty' => 40, 'reorder' => 15],
                ['sku' => 'HOM-6003', 'name' => 'Ninja Air Fryer XL',         'price' => 149.00,  'qty' => 35, 'reorder' => 10],
                ['sku' => 'HOM-6004', 'name' => 'Keurig K-Elite Coffee Maker','price' => 189.00,  'qty' => 22, 'reorder' => 8],
                ['sku' => 'HOM-6005', 'name' => 'Philips Hue Starter Kit',    'price' => 199.00,  'qty' => 3,  'reorder' => 6],
            ],
            'Wearables & Smart Devices' => [
                ['sku' => 'WEA-7001', 'name' => 'Apple Watch Series 9',       'price' => 399.00,  'qty' => 40, 'reorder' => 10],
                ['sku' => 'WEA-7002', 'name' => 'Samsung Galaxy Watch 6',     'price' => 299.00,  'qty' => 28, 'reorder' => 10],
                ['sku' => 'WEA-7003', 'name' => 'Garmin Fenix 7X Pro',        'price' => 899.00,  'qty' => 8,  'reorder' => 3],
                ['sku' => 'WEA-7004', 'name' => 'Fitbit Charge 6',            'price' => 159.00,  'qty' => 55, 'reorder' => 20],
                ['sku' => 'WEA-7005', 'name' => 'Oura Ring Gen 3',            'price' => 299.00,  'qty' => 2,  'reorder' => 5],
            ],
            'Networking Equipment' => [
                ['sku' => 'NET-8001', 'name' => 'TP-Link Archer AXE300',      'price' => 349.00,  'qty' => 18, 'reorder' => 5],
                ['sku' => 'NET-8002', 'name' => 'Netgear Nighthawk RAXE500',  'price' => 599.00,  'qty' => 9,  'reorder' => 3],
                ['sku' => 'NET-8003', 'name' => 'Ubiquiti UniFi Dream Router','price' => 199.00,  'qty' => 25, 'reorder' => 8],
                ['sku' => 'NET-8004', 'name' => 'TP-Link Deco XE75 (3-pack)', 'price' => 299.00,  'qty' => 12, 'reorder' => 5],
                ['sku' => 'NET-8005', 'name' => 'Netgear GS308 8-Port Switch','price' => 39.00,   'qty' => 0,  'reorder' => 10],
            ],
            'Office Supplies' => [
                ['sku' => 'OFF-9001', 'name' => 'HP LaserJet Pro M404dn',     'price' => 249.00,  'qty' => 16, 'reorder' => 5],
                ['sku' => 'OFF-9002', 'name' => 'Canon PIXMA TR8620',         'price' => 179.00,  'qty' => 20, 'reorder' => 5],
                ['sku' => 'OFF-9003', 'name' => 'Brother HL-L2350DW',         'price' => 129.00,  'qty' => 30, 'reorder' => 10],
                ['sku' => 'OFF-9004', 'name' => 'Fellowes Powershred 79Ci',   'price' => 189.00,  'qty' => 6,  'reorder' => 3],
            ],
            'Accessories & Cables' => [
                ['sku' => 'ACC-1101', 'name' => 'Anker 737 Power Bank',       'price' => 149.00,  'qty' => 60, 'reorder' => 20],
                ['sku' => 'ACC-1102', 'name' => 'Apple MagSafe Charger',      'price' => 39.00,   'qty' => 90, 'reorder' => 30],
                ['sku' => 'ACC-1103', 'name' => 'Belkin Thunderbolt 4 Hub',   'price' => 199.00,  'qty' => 18, 'reorder' => 5],
                ['sku' => 'ACC-1104', 'name' => 'USB-C to USB-C Cable 2m',    'price' => 19.00,   'qty' => 120,'reorder' => 40],
                ['sku' => 'ACC-1105', 'name' => 'Spigen iPhone 15 Pro Case',  'price' => 29.00,   'qty' => 4,  'reorder' => 15],
                ['sku' => 'ACC-1106', 'name' => 'Logitech MX Master 3S',      'price' => 99.00,   'qty' => 45, 'reorder' => 15],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = $categories->firstWhere('name', $categoryName);
            if (! $category) continue;

            foreach ($products as $p) {
                Product::create([
                    'category_id'   => $category->id,
                    'sku'           => $p['sku'],
                    'name'          => $p['name'],
                    'description'   => "{$p['name']} — high quality product in {$categoryName}.",
                    'price'         => $p['price'],
                    'quantity'      => $p['qty'],
                    'reorder_level' => $p['reorder'],
                    'image'         => null,
                ]);
            }
        }

        // =========================================================
        // === Stock movements (realistic, chronological) ==========
        // =========================================================
        $allUsers = User::all();
        $allProducts = Product::all();

        foreach ($allProducts as $product) {
            // Every product starts with a stock-in for initial inventory
            StockMovement::create([
                'product_id' => $product->id,
                'user_id'    => $admin->id,
                'type'       => 'in',
                'quantity'   => $product->quantity + rand(0, 20),
                'reference'  => 'PO-' . str_pad((string) $product->id, 5, '0', STR_PAD_LEFT),
                'notes'      => 'Initial stock intake.',
                'created_at' => now()->subDays(rand(30, 90)),
            ]);

            // 1–3 additional movements per product
            $extra = rand(1, 3);
            for ($i = 0; $i < $extra; $i++) {
                $type = collect(['in', 'out', 'adjustment'])->random();
                StockMovement::create([
                    'product_id' => $product->id,
                    'user_id'    => $allUsers->random()->id,
                    'type'       => $type,
                    'quantity'   => rand(1, 20),
                    'reference'  => strtoupper($type) . '-' . strtoupper(fake()->bothify('??####')),
                    'notes'      => fake()->optional(0.5)->sentence(),
                    'created_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}