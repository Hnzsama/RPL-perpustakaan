<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('members/page', [
            'members' => Member::whereNull('user_id')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:members',
            'phone' => 'nullable',
            'address' => 'nullable',
        ]);

        $lastMember = Member::orderBy('id', 'desc')->first();
        $nextId = $lastMember ? $lastMember->id + 1 : 1;
        $validated['member_code'] = 'MEM-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        Member::create($validated);

        return back()->with('status', 'Anggota berhasil ditambahkan.');
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:members,email,' . $member->id,
            'phone' => 'nullable',
            'address' => 'nullable',
        ]);

        $member->update($validated);

        return back()->with('status', 'Data anggota berhasil diperbarui.');
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return back()->with('status', 'Anggota berhasil dihapus.');
    }
}
