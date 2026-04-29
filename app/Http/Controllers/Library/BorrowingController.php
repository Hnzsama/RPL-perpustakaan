<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BorrowingController extends Controller
{
    public function index()
    {
        try {
            // Automatically process overdues and fines before serving the page
            \App\Services\OverdueService::processOverdue();

            $borrowings = Borrowing::with(['book', 'member'])->get();

            return Inertia::render('borrowings/page', [
                'borrowings' => $borrowings,
                'books' => Book::where('stock', '>', 0)->get(),
                'members' => Member::whereNull('user_id')->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('Borrowing Index Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat data peminjaman: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'member_id' => 'required|exists:members,id',
            'borrow_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:borrow_date',
        ]);

        try {
            DB::beginTransaction();

            $validated['status'] = 'borrowed';

            Borrowing::create($validated);

            // Decrease book stock
            $book = Book::findOrFail($validated['book_id']);
            $book->decrement('stock');

            DB::commit();

            return back()->with('status', 'Peminjaman berhasil dicatat.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Borrowing Store Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat mencatat peminjaman: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Borrowing $borrowing)
    {
        $validated = $request->validate([
            'status' => 'required|in:borrowed,returned,overdue',
            'return_date' => 'nullable|date',
        ]);

        try {
            DB::beginTransaction();

            $oldStatus = $borrowing->status;
            $borrowing->update($validated);

            // If returned, increase book stock
            if ($oldStatus !== 'returned' && $validated['status'] === 'returned') {
                $borrowing->book->increment('stock');
            }

            DB::commit();

            return back()->with('status', 'Status peminjaman diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Borrowing Update Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui status peminjaman: ' . $e->getMessage());
        }
    }

    public function destroy(Borrowing $borrowing)
    {
        try {
            DB::beginTransaction();

            if ($borrowing->status === 'borrowed') {
                $borrowing->book->increment('stock');
            }
            $borrowing->delete();

            DB::commit();

            return back()->with('status', 'Data peminjaman dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Borrowing Destroy Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menghapus data peminjaman: ' . $e->getMessage());
        }
    }
}
