<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Fine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FineController extends Controller
{
    public function index(): Response
    {
        // Automatically process overdues and fines before serving the page
        \App\Services\OverdueService::processOverdue();

        return Inertia::render('fines/page', [
            'fines' => Fine::with(['borrowing.book', 'borrowing.member'])->get(),
            'borrowings' => Borrowing::whereDoesntHave('fine')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'borrowing_id' => 'required|exists:borrowings,id|unique:fines',
            'amount' => 'required|numeric|min:0',
        ]);

        $validated['payment_status'] = 'unpaid';

        Fine::create($validated);

        return back()->with('status', 'Denda berhasil dicatat.');
    }

    public function update(Request $request, Fine $fine)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:unpaid,paid',
        ]);

        $fine->update($validated);

        return back()->with('status', 'Data denda diperbarui.');
    }

    public function destroy(Fine $fine)
    {
        $fine->delete();

        return back()->with('status', 'Data denda dihapus.');
    }
}
