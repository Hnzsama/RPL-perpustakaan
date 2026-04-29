<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
    public function index()
    {
        try {
            return Inertia::render('books/page', [
                'books' => Book::with('category')->get(),
                'categories' => Category::all(),
            ]);
        } catch (\Exception $e) {
            Log::error('Book Index Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat data buku: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required',
            'author' => 'required',
            'publisher' => 'required',
            'isbn' => 'required|unique:books',
            'year' => 'required|integer',
            'stock' => 'required|integer|min:0',
        ]);

        try {
            DB::beginTransaction();
            Book::create($validated);
            DB::commit();

            return back()->with('status', 'Buku berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Book Store Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menambahkan buku: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required',
            'author' => 'required',
            'publisher' => 'required',
            'isbn' => 'required|unique:books,isbn,' . $book->id,
            'year' => 'required|integer',
            'stock' => 'required|integer|min:0',
        ]);

        try {
            DB::beginTransaction();
            $book->update($validated);
            DB::commit();

            return back()->with('status', 'Data buku berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Book Update Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui buku: ' . $e->getMessage());
        }
    }

    public function destroy(Book $book)
    {
        try {
            DB::beginTransaction();
            $book->delete();
            DB::commit();

            return back()->with('status', 'Buku berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Book Destroy Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menghapus buku: ' . $e->getMessage());
        }
    }
}
