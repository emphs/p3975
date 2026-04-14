<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate the data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Check if the user exists
        $user = User::where('email', $request->email)->first();

        // 3. Verify credentials
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }

        // 4. Generate the plain text token for React
        $token = $user->createToken('react-app-token')->plainTextToken;

        // 5. Return the token and user data as JSON
        return response()->json([
            'token' => $token,
            'user' => $user,
            'is_admin' => (bool) $user->is_admin
        ]);
    }

    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}