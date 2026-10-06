<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller {
    public function index() {
        return [
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_stock_value' => Product::sum(DB::raw('price * quantity')),
            'low_stock_count' => Product::whereColumn('quantity', '<=', 'reorder_level')->count(),
            'recent_movements' => StockMovement::with('product:id,name,sku')->latest()->limit(10)->get(),
            'low_stock_products' => Product::whereColumn('quantity', '<=', 'reorder_level')
                ->orderBy('quantity')->limit(10)->get(['id','name','sku','quantity','reorder_level']),
        ];
    }
}