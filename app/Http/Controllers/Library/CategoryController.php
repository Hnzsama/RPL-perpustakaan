<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            return Inertia::render('categories/page', [
                'categories' => Category::all(),
            ]);
        } catch (\Exception $e) {
            Log::error('Category Index Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat data kategori: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:categories',
            'slug' => 'required|unique:categories',
        ]);

        try {
            DB::beginTransaction();
            Category::create($validated);
            DB::commit();

            return back()->with('status', 'Kategori berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category Store Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menambahkan kategori: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|unique:categories,name,' . $category->id,
            'slug' => 'required|unique:categories,slug,' . $category->id,
        ]);

        try {
            DB::beginTransaction();
            $category->update($validated);
            DB::commit();

            return back()->with('status', 'Kategori berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category Update Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui kategori: ' . $e->getMessage());
        }
    }

    public function destroy(Category $category)
    {
        try {
            DB::beginTransaction();
            $category->delete();
            DB::commit();

            return back()->with('status', 'Kategori berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category Destroy Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menghapus kategori: ' . $e->getMessage());
        }
    }
}
