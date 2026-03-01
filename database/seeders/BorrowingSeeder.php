<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\Member;
use App\Models\Borrowing;
use Carbon\Carbon;

class BorrowingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $book1 = Book::first();
        $book2 = Book::skip(1)->first();
        $member1 = Member::first();
        $member2 = Member::skip(1)->first();

        if (!$book1 || !$book2 || !$member1 || !$member2) {
            return;
        }

        // Borrowing 1: Overdue by 10 days (2 weeks roughly for calculation)
        Borrowing::create([
            'book_id' => $book1->id,
            'member_id' => $member1->id,
            'borrow_date' => Carbon::now()->subDays(24)->toDateString(),
            'due_date' => Carbon::now()->subDays(10)->toDateString(),
            'status' => 'overdue',
        ]);

        // Borrowing 2: Overdue by 20 days (3 weeks roughly for calculation)
        Borrowing::create([
            'book_id' => $book2->id,
            'member_id' => $member2->id,
            'borrow_date' => Carbon::now()->subDays(34)->toDateString(),
            'due_date' => Carbon::now()->subDays(20)->toDateString(),
            'status' => 'overdue',
        ]);

        // Borrowing 3: Active (not overdue)
        Borrowing::create([
            'book_id' => $book1->id,
            'member_id' => $member2->id,
            'borrow_date' => Carbon::now()->subDays(2)->toDateString(),
            'due_date' => Carbon::now()->addDays(5)->toDateString(),
            'status' => 'borrowed',
        ]);
    }
}
