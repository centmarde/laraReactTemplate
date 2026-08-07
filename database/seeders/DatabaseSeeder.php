<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Transactions;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
       /*  Transactions::factory(10)->create(); */

        /* User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]); */

           /*  DB::table('transactions')->insert([
            'name' => Str::random(10),
            'description' => Str::random(10),
            'user_id' => 1,
            'image_path' => 'path/to/image.jpg',
        ]); */

        for ($i = 0; $i < 10; $i++) {
            DB::table('transactions')->insert([
                'name' => Str::random(10),
                'description' => Str::random(10),
                'user_id' => 1,
                'image_path' => 'path/to/image.jpg',
            ]);
        }

    }
}
