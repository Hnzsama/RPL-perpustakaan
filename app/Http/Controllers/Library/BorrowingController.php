<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Member;
use App\Models\LibrarySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class BorrowingController extends Controller
{
    public function index(): Response
    {
        // Automatically process overdues and fines before serving the page
        \App\Services\OverdueService::processOverdue();

        $borrowings = Borrowing::with(['book', 'member'])->get();

        return Inertia::render('borrowings/page', [
            'borrowings' => $borrowings,
            'books' => Book::where('stock', '>', 0)->get(),
            'members' => Member::whereNull('user_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'member_id' => 'required|exists:members,id',
            'borrow_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:borrow_date',
        ]);

        $validated['status'] = 'borrowed';

        Borrowing::create($validated);

        // Decrease book stock
        $book = Book::findOrFail($validated['book_id']);
        $book->decrement('stock');

        return back()->with('status', 'Peminjaman berhasil dicatat.');
    }

    public function update(Request $request, Borrowing $borrowing)
    {
        $validated = $request->validate([
            'status' => 'required|in:borrowed,returned,overdue',
            'return_date' => 'nullable|date',
        ]);

        $oldStatus = $borrowing->status;
        $borrowing->update($validated);

        // If returned, increase book stock
        if ($oldStatus !== 'returned' && $validated['status'] === 'returned') {
            $borrowing->book->increment('stock');
        }

        return back()->with('status', 'Status peminjaman diperbarui.');
    }

    public function destroy(Borrowing $borrowing)
    {
        if ($borrowing->status === 'borrowed') {
            $borrowing->book->increment('stock');
        }
        $borrowing->delete();

        return back()->with('status', 'Data peminjaman dihapus.');
    }
}
