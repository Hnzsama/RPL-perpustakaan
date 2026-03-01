<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Member::create([
            'member_code' => 'M001',
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'address' => '123 Library St',
            'phone' => '08123456789',
        ]);

        \App\Models\Member::create([
            'member_code' => 'M002',
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'address' => '456 Book Ave',
            'phone' => '08987654321',
        ]);
    }
}
