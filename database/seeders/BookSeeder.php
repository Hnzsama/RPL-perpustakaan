<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $it = \App\Models\Category::where('name', 'Information Technology')->first();
        $fiction = \App\Models\Category::where('name', 'Fiction')->first();

        \App\Models\Book::create([
            'category_id' => $it->id,
            'title' => 'Laravel Advanced Patterns',
            'author' => 'Jeffrey Way',
            'publisher' => 'Laracasts',
            'isbn' => '978-1-2345-6789-0',
            'year' => 2023,
            'stock' => 5,
            'description' => 'Mastering advanced Laravel patterns and best practices.',
        ]);

        \App\Models\Book::create([
            'category_id' => $fiction->id,
            'title' => 'The Great Gatsby',
            'author' => 'F. Scott Fitzgerald',
            'publisher' => 'Scribner',
            'isbn' => '978-0-7432-7356-5',
            'year' => 1925,
            'stock' => 3,
            'description' => 'A classic novel of the Jazz Age.',
        ]);
    }
}
