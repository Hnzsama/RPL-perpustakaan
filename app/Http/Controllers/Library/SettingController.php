<?php

namespace App\Http\Controllers\Library;

use App\Http\Controllers\Controller;
use App\Models\LibrarySetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('settings/page', [
            'settings' => LibrarySetting::all(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|exists:library_settings,key',
            'settings.*.value' => 'required',
        ]);

        foreach ($validated['settings'] as $item) {
            LibrarySetting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return back()->with('status', 'Pengaturan berhasil diperbarui.');
    }
}
