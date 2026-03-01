<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Fine;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Calculate Summary Stats
        $totalBooks = Book::sum('stock');
        $activeMembers = Member::whereNull('user_id')->count();
        $activeBorrowings = Borrowing::where('status', 'borrowed')->count();
        $totalRevenue = Fine::where('payment_status', 'paid')->sum('amount');
        
        // 2. Calculate Trends (Simple growth calculation for borrowings this month vs last month)
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();
        
        $borrowingsThisMonth = Borrowing::where('borrow_date', '>=', $startOfMonth)->count();
        $borrowingsLastMonth = Borrowing::whereBetween('borrow_date', [$startOfLastMonth, $endOfLastMonth])->count();
        
        $borrowingGrowth = 0;
        if ($borrowingsLastMonth > 0) {
            $borrowingGrowth = (($borrowingsThisMonth - $borrowingsLastMonth) / $borrowingsLastMonth) * 100;
        } else if ($borrowingsThisMonth > 0) {
            $borrowingGrowth = 100;
        }

        // 3. Chart Data (Last 90 Days Borrowings)
        $ninetyDaysAgo = Carbon::now()->subDays(90);
        $borrowingsData = Borrowing::select(
                DB::raw('DATE(borrow_date) as date'),
                DB::raw('count(*) as count')
            )
            ->where('borrow_date', '>=', $ninetyDaysAgo)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();
            
        $chartData = $borrowingsData->map(function ($item) {
            return [
                'date' => $item->date,
                'desktop' => $item->count, // Using 'desktop' key to match the shadcn chart example directly if not changed
            ];
        });

        // Ensure we handle $totalBooks potentially being null if table is empty
        $totalBooks = $totalBooks ?: 0;
        $totalRevenue = $totalRevenue ?: 0;

        return Inertia::render('dashboard', [
            'stats' => [
                'totalBooks' => (int) $totalBooks,
                'activeMembers' => $activeMembers,
                'activeBorrowings' => $activeBorrowings,
                'totalRevenue' => (int) $totalRevenue,
                'borrowingGrowth' => round($borrowingGrowth, 1),
            ],
            'chartData' => $chartData,
        ]);
    }
}
