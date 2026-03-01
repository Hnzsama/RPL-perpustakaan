<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('library_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value');
            $table->string('type')->default('string'); // string, integer, decimal
            $table->string('label')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('library_settings')->insert([
            [
                'key' => 'base_fine',
                'value' => '5000',
                'type' => 'decimal',
                'label' => 'Nominal Denda Dasar',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'weekly_increment',
                'value' => '2000',
                'type' => 'decimal',
                'label' => 'Tambahan Per Minggu',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('library_settings');
    }
};
