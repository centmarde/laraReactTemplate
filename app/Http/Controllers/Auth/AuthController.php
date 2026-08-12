<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Login;
use App\Services\Auth\AuthService;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request, AuthService $authService)
    {
        $validated = $request->validated();

        $user = $authService->createUser($validated);

        event(new Registered($user));

        $user = $authService->getUser($user);

        $token = $user->createToken($user->email)->plainTextToken;

        return response()->json([
            'userData'          => $user,
            'accessToken'       => $token,
        ], 201);
    }

    /**
     * Login the user.
     */
    public function login(LoginRequest $request, AuthService $authService)
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password))
            return response()->json(['message' => 'The email or password is incorrect.'], 404);

        event(new Login('sanctum', $user, $request->boolean('remember')));

        // If a new/unknown device requires 2FA, the IP is only blessed after
        // the SMS code is verified (see VerifyController::sms_code).
        $requiresTwoFactor = $authService->sendTwoFactorAuthentication($user, $request->ip()) !== null;

        if (!$requiresTwoFactor) {
            $authService->updateLoginIp($user, $request->ip());
        }

        $user = $authService->getUser($user);

        $token = $user->createToken($user->email)->plainTextToken;

        return response()->json([
            'userData'          => $user,
            'accessToken'       => $token,
            'requiresTwoFactor' => $requiresTwoFactor,
        ], 200);
    }

    /**
     * Logout the user.
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        event(new Logout('sanctum', $request->user()));

        return response()->json([], 204);
    }
}
