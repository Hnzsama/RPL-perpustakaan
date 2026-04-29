<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\LibrarySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function index()
    {
        try {
            return Inertia::render('settings/page', [
                'settings' => LibrarySetting::all(),
            ]);
        } catch (\Exception $e) {
            Log::error('Setting Index Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat daftar pengaturan: ' . $e->getMessage());
        }
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|exists:library_settings,key',
            'settings.*.value' => 'required',
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['settings'] as $item) {
                LibrarySetting::where('key', $item['key'])->update(['value' => $item['value']]);
            }

            DB::commit();

            return back()->with('status', 'Pengaturan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Setting Update Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui pengaturan: ' . $e->getMessage());
        }
    }
}
