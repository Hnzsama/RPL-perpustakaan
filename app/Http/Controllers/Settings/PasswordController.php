<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit()
    {
        try {
            return Inertia::render('settings/password');
        } catch (\Exception $e) {
            Log::error('Password Edit Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat halaman pengaturan password: ' . $e->getMessage());
        }
    }

    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $request->user()->update([
                'password' => $request->password,
            ]);

            DB::commit();

            return back();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Password Update Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui password: ' . $e->getMessage());
        }
    }
}
