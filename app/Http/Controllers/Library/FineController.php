<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Fine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class FineController extends Controller
{
    public function index()
    {
        try {
            // Automatically process overdues and fines before serving the page
            \App\Services\OverdueService::processOverdue();

            return Inertia::render('fines/page', [
                'fines' => Fine::with(['borrowing.book', 'borrowing.member'])->get(),
                'borrowings' => Borrowing::whereDoesntHave('fine')->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('Fine Index Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat data denda: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'borrowing_id' => 'required|exists:borrowings,id|unique:fines',
            'amount' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();
            $validated['payment_status'] = 'unpaid';
            Fine::create($validated);
            DB::commit();

            return back()->with('status', 'Denda berhasil dicatat.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Fine Store Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat mencatat denda: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Fine $fine)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:unpaid,paid',
        ]);

        try {
            DB::beginTransaction();
            $fine->update($validated);
            DB::commit();

            return back()->with('status', 'Data denda diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Fine Update Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui denda: ' . $e->getMessage());
        }
    }

    public function destroy(Fine $fine)
    {
        try {
            DB::beginTransaction();
            $fine->delete();
            DB::commit();

            return back()->with('status', 'Data denda dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Fine Destroy Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menghapus denda: ' . $e->getMessage());
        }
    }
}
