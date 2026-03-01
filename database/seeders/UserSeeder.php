<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::create([
            'name' => 'Admin Perpustakaan',
            'email' => 'admin@perpus.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        \App\Models\Member::create([
            'user_id' => $admin->id,
            'member_code' => 'ADM-001',
            'name' => 'Admin Perpustakaan',
            'email' => 'admin@perpus.com',
            'address' => 'Admin Office',
            'phone' => '08111111111',
        ]);
    }
}
