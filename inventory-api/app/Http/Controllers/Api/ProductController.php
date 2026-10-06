<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {
    public function index(Request $request) {
        $query = Product::with('category');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%");
            });
        }
        if ($request->category_id) $query->where('category_id', $request->category_id);
        if ($request->low_stock) $query->whereColumn('quantity', '<=', 'reorder_level');

        return $query->latest()->paginate($request->per_page ?? 15);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'sku' => 'required|string|unique:products',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'reorder_level' => 'integer|min:0',
        ]);
        return response()->json(Product::create($data), 201);
    }

    public function show(Product $product) {
        return $product->load(['category', 'movements' => fn($q) => $q->latest()->limit(20)]);
    }

    public function update(Request $request, Product $product) {
        $data = $request->validate([
            'sku' => 'sometimes|string|unique:products,sku,'.$product->id,
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'quantity' => 'sometimes|integer|min:0',
            'reorder_level' => 'sometimes|integer|min:0',
        ]);
        $product->update($data);
        return $product;
    }

    public function destroy(Product $product) {
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}