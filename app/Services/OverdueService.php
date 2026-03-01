<?php

namespace App\Services;

use App\Models\Borrowing;
use App\Models\Fine;
use App\Models\LibrarySetting;
use Carbon\Carbon;

class OverdueService
{
    public static function processOverdue()
    {
        $baseFine = LibrarySetting::get('base_fine', 5000);
        $weeklyIncrement = LibrarySetting::get('weekly_increment', 2000);
        $now = Carbon::now();

        // 1. Update status to 'overdue' for borrowed items past due date
        Borrowing::where('status', 'borrowed')
            ->where('due_date', '<', $now->toDateString())
            ->update(['status' => 'overdue']);

        // 2. Calculate and generate/update fines for all overdue items
        $overdueBorrowings = Borrowing::where('status', 'overdue')->get();

        foreach ($overdueBorrowings as $borrowing) {
            $dueDate = Carbon::parse($borrowing->due_date);
            
            if ($now->greaterThan($dueDate)) {
                $daysDiff = $dueDate->diffInDays($now);
                $weeksDiff = ceil($daysDiff / 7);
                
                $calculatedFine = $baseFine + (($weeksDiff - 1) * $weeklyIncrement);
                if ($calculatedFine < $baseFine) $calculatedFine = $baseFine;

                // Create or update the fine record
                $fine = Fine::firstOrNew(['borrowing_id' => $borrowing->id]);
                
                // Only update amount if it's unpaid
                if ($fine->payment_status !== 'paid') {
                    $fine->amount = $calculatedFine;
                    $fine->payment_status = $fine->exists ? $fine->payment_status : 'unpaid';
                    $fine->save();
                }
            }
        }
    }
}
