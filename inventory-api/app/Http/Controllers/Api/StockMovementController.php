<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller {
    public function index(Request $request) {
        return StockMovement::with(['product:id,name,sku', 'user:id,name'])
            ->when($request->product_id, fn($q) => $q->where('product_id', $request->product_id))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->latest()
            ->paginate($request->per_page ?? 20);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer|min:1',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);

            if ($data['type'] === 'in') {
                $product->quantity += $data['quantity'];
            } elseif ($data['type'] === 'out') {
                if ($product->quantity < $data['quantity']) {
                    return response()->json(['message' => 'Insufficient stock'], 422);
                }
                $product->quantity -= $data['quantity'];
            } else { // adjustment - set exact quantity
                $product->quantity = $data['quantity'];
            }
            $product->save();

            $movement = StockMovement::create([
                ...$data,
                'user_id' => $request->user()?->id,
            ]);

            return response()->json($movement->load('product'), 201);
        });
    }
}