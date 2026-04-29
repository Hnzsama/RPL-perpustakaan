<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    public function index()
    {
        try {
            return Inertia::render('members/page', [
                'members' => Member::whereNull('user_id')->latest()->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('Member Index Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat data anggota: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:members',
            'phone' => 'nullable',
            'address' => 'nullable',
        ]);

        try {
            DB::beginTransaction();

            $lastMember = Member::orderBy('id', 'desc')->first();
            $nextId = $lastMember ? $lastMember->id + 1 : 1;
            $validated['member_code'] = 'MEM-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            Member::create($validated);

            DB::commit();

            return back()->with('status', 'Anggota berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Member Store Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menambahkan anggota: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:members,email,' . $member->id,
            'phone' => 'nullable',
            'address' => 'nullable',
        ]);

        try {
            DB::beginTransaction();
            $member->update($validated);
            DB::commit();

            return back()->with('status', 'Data anggota berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Member Update Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data anggota: ' . $e->getMessage());
        }
    }

    public function destroy(Member $member)
    {
        try {
            DB::beginTransaction();
            $member->delete();
            DB::commit();

            return back()->with('status', 'Anggota berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Member Destroy Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menghapus anggota: ' . $e->getMessage());
        }
    }
}
