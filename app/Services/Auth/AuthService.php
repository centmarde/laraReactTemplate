<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\VerificationCode;
use App\Mail\PrivacyTermsMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthService
{
    /**
     * Create a new user from validated registration data.
     */
    public function createUser(array $validated): User
    {
        $values = [
            'firstname'         => $validated['firstname'] ?? null,
            'lastname'          => $validated['lastname'] ?? null,
            'name'              => trim(($validated['firstname'] ?? '') . ' ' . ($validated['lastname'] ?? '')),
            'email'             => $validated['email'],
            'password'          => Hash::make($validated['password']),
            'country'           => $validated['country'] ?? null,
            'state_province'    => $validated['state_province'] ?? null,
            'city'              => $validated['city'] ?? null,
            'postal_zip'        => $validated['postal_zip'] ?? null,
            'is_2fa_enabled'    => (bool) ($validated['is_2fa_enabled'] ?? false),
            // Email verification is currently skipped, so accounts are verified on registration.
            'email_verified_at' => now(),
        ];

        return User::create($values);
    }

    /**
     * Retrieve the auth user information including role and allowed pages.
     */
    public function getUser($user): ?User
    {
        return User::with(['userRole', 'userRole.userRolePages'])->find($user->id);
    }

    /**
     * Send an email verification code if the user's email is not yet verified.
     */
    public function sendEmailVerificationNotification($user): void
    {
        if ($user->email_verified_at !== null) {
            return;
        }

        $code = $this->generateVerificationCode($user->email, 'email');

        Mail::to($user->email)->send(new PrivacyTermsMail($user->email, $user->name, (string) $code));
    }

    /**
     * Handle Two-Factor Authentication.
     *
     * If 2FA is enabled and the request originates from a different IP than the
     * last successful login, an SMS verification code is generated and returned
     * (logged in development since no SMS gateway is configured).
     */
    public function sendTwoFactorAuthentication($user, ?string $ip = null): ?string
    {
        // Return if 2FA is disabled
        if ((bool) $user->is_2fa_enabled === false) {
            return null;
        }

        $ip = $ip ?? request()->ip();

        // Trusted device - the same IP as the last successful login.
        if ((string) $user->lastSuccessfulLoginIp() === (string) $ip) {
            return null;
        }

        // New/unknown device - issue an SMS code.
        $code = $this->generateVerificationCode($user->email, 'sms');

        Log::info("2FA SMS code for user {$user->email}: {$code}");

        return (string) $code;
    }

    /**
     * Generate, persist and return a fresh verification code.
     */
    protected function generateVerificationCode(string $email, string $type): int
    {
        VerificationCode::where('email', $email)->where('type', $type)->delete();

        $code = random_int(100000, 999999);

        VerificationCode::create([
            'email'      => $email,
            'type'       => $type,
            'code'       => Hash::make((string) $code),
            'expires_at' => now()->addMinutes(10),
        ]);

        return $code;
    }

    /**
     * Verify a supplied code against a stored one for the given email/type.
     */
    public function verifyCode(string $code, string $email, string $type): bool
    {
        $record = VerificationCode::where('email', $email)
            ->where('type', $type)
            ->latest()
            ->first();

        if (! $record || $record->expires_at->isPast()) {
            return false;
        }

        if (! Hash::check($code, $record->code)) {
            return false;
        }

        // Codes are single-use.
        $record->delete();

        return true;
    }

    /**
     * Rotate the recorded login IPs after a successful (2FA approved) login.
     */
    public function updateLoginIp($user, ?string $ip = null): void
    {
        $ip = $ip ?? request()->ip();

        $user->forceFill([
            'previous_login_ip'         => $user->last_successful_login_ip,
            'last_successful_login_ip'  => $ip,
        ])->save();
    }

    /**
     * Send welcome email.
     */
    public function sendWelcomeEmail($user): void
    {
        Mail::to($user->email)->send(new PrivacyTermsMail($user->email, $user->name));
    }
}
