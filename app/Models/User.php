<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'firstname', 'lastname', 'email', 'email_verified_at', 'password', 'country', 'state_province', 'city', 'postal_zip', 'role_id', 'is_2fa_enabled', 'last_successful_login_ip', 'previous_login_ip'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_2fa_enabled' => 'boolean',
        ];
    }

    /**
     * The role that belongs to this user.
     */
    public function userRole(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * The transactions that belong to this user (many-to-many via transaction_user pivot).
     */
    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class, 'transaction_user');
    }

    /**
     * The IP address of the last successful login.
     */
    public function lastSuccessfulLoginIp(): ?string
    {
        return $this->last_successful_login_ip;
    }

    /**
     * The IP address recorded before the last successful login.
     */
    public function previousLoginIp(): ?string
    {
        return $this->previous_login_ip;
    }

    /**
     * Suppress the framework's built-in verification notification.
     *
     * Email verification is handled by AuthService using one-time codes, so the
     * default signed-URL notification (which requires a "verification.verify"
     * route we do not define) is intentionally disabled.
     */
    public function sendEmailVerificationNotification(): void
    {
        // no-op
    }
}
