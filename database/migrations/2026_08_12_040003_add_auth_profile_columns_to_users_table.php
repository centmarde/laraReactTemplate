<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->string('firstname')->nullable()->after('name');
            $table->string('lastname')->nullable()->after('firstname');
            $table->string('country')->nullable();
            $table->string('state_province')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_zip')->nullable();
            $table->boolean('is_2fa_enabled')->default(false);
            $table->string('last_successful_login_ip', 45)->nullable();
            $table->string('previous_login_ip', 45)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
            $table->dropColumn([
                'firstname',
                'lastname',
                'country',
                'state_province',
                'city',
                'postal_zip',
                'is_2fa_enabled',
                'last_successful_login_ip',
                'previous_login_ip',
            ]);
        });
    }
};
