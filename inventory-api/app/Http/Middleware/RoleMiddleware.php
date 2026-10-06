<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! $user->is_active) {
            return response()->json([
                'message' => 'You do not have permission to perform this action.',
                'required_roles' => $roles,
            ], 403);
        }

        if (! empty($roles) && ! $user->hasRole(...$roles)) {
            return response()->json([
                'message' => 'You do not have permission to perform this action.',
                'required_roles' => $roles,
            ], 403);
        }

        return $next($request);
    }
}