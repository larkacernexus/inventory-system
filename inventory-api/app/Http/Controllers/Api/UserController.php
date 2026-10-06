<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return User::query()
            ->when($request->search, function ($q, $s) {
                $q->where(function ($w) use ($s) {
                    $w->where('name', 'like', "%{$s}%")
                      ->orWhere('email', 'like', "%{$s}%");
                });
            })
            ->when($request->role, fn ($q, $r) => $q->where('role', $r))
            ->latest()
            ->paginate($request->per_page ?? 15);
    }

    public function store(Request $request)
    {
        $actor = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => ['required', Rule::in(['admin', 'manager', 'staff'])],
            'is_active' => 'boolean',
        ]);

        // Managers cannot create admins
        if ($actor->isManager() && $data['role'] === 'admin') {
            return response()->json([
                'message' => 'Managers cannot create admin accounts.',
            ], 403);
        }

        $data['password'] = Hash::make($data['password']);

        return response()->json(User::create($data), 201);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $actor = $request->user();

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6|confirmed',
            'role' => ['sometimes', Rule::in(['admin', 'manager', 'staff'])],
            'is_active' => 'sometimes|boolean',
        ]);

        // Managers can only touch staff accounts
        if ($actor->isManager() && ! $user->isStaff()) {
            return response()->json([
                'message' => 'Managers can only edit staff accounts.',
            ], 403);
        }

        // Managers cannot promote anyone to admin
        if ($actor->isManager() && isset($data['role']) && $data['role'] === 'admin') {
            return response()->json([
                'message' => 'Managers cannot promote users to admin.',
            ], 403);
        }

        // Nobody can demote themselves
        if ($actor->id === $user->id
            && isset($data['role'])
            && $data['role'] !== $actor->role) {
            return response()->json([
                'message' => 'You cannot change your own role.',
            ], 403);
        }

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user;
    }

    public function destroy(Request $request, User $user)
    {
        $actor = $request->user();

        // Can't delete yourself
        if ($actor->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        // Managers can only delete staff
        if ($actor->isManager() && ! $user->isStaff()) {
            return response()->json([
                'message' => 'Managers can only delete staff accounts.',
            ], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }
}