<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('books/page', [
            'books' => Book::with('category')->get(),
            'categories' => Category::all(),
        ]);
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

        Book::create($validated);

        return back()->with('status', 'Buku berhasil ditambahkan.');
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

        $book->update($validated);

        return back()->with('status', 'Data buku berhasil diperbarui.');
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return back()->with('status', 'Buku berhasil dihapus.');
    }
}
