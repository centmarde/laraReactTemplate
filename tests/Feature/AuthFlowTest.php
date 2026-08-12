<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_auto_verifies_email_and_login(): void
    {
        $payload = [
            'firstname' => 'John',
            'lastname' => 'Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        // Register
        $register = $this->postJson('/api/register', $payload);

        $register->assertStatus(201)
            ->assertJsonStructure(['userData', 'accessToken']);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);

        // Email verification is skipped -> the account is verified on registration.
        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user);
        $this->assertNotNull($user->email_verified_at);

        // Login
        $login = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        $login->assertStatus(200)->assertJsonStructure(['userData', 'accessToken']);
    }

    public function test_login_requires_two_factor_verification_when_enabled(): void
    {
        User::factory()->create([
            'email' => '2fa@example.com',
            'password' => 'password123',
            'is_2fa_enabled' => true,
        ]);

        $login = $this->postJson('/api/login', [
            'email' => '2fa@example.com',
            'password' => 'password123',
        ]);

        $login->assertStatus(200)->assertJsonPath('requiresTwoFactor', true);

        // A wrong SMS code must be rejected.
        $token = $login->json('accessToken');

        $wrong = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/verify/sms', ['code' => '000000']);

        $wrong->assertStatus(422);
    }
}
