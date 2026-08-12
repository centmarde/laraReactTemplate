<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Services\Auth\AuthService;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;

class VerifyController extends Controller
{
    /**
     * Verify the email verification code.
     */
    public function email_code(Request $request, AuthService $authService)
    {
        $user = $request->user();

        $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $verified = $authService->verifyCode($request->code, $user->email, 'email');

        if (!$verified)
            return response()->json(['message' => 'The code is incorrect or has expired.'], 422);

        if ($user->markEmailAsVerified())
            event(new Verified($user));

        $authService->sendWelcomeEmail($user);

        $user = $authService->getUser($user);

        return response()->json([
            'userData'      => $user,
        ], 200);
    }

    /**
     * Verify the sms 2fa code.
     */
    public function sms_code(Request $request, AuthService $authService)
    {
        $user = $request->user();

        $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $verified = $authService->verifyCode($request->code, $user->email, 'sms');

        if (!$verified)
            return response()->json(['message' => 'The SMS code is incorrect or has expired.'], 422);

        // Bless the current device so future logins on this IP skip 2FA.
        $authService->updateLoginIp($user, $request->ip());

        $user = $authService->getUser($user);

        return response()->json([
            'userData'      => $user,
        ], 200);
    }
}
