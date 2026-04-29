<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Log;

class TwoFactorAuthenticationController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')
            ? [new Middleware('password.confirm', only: ['show'])]
            : [];
    }

    /**
     * Show the user's two-factor authentication settings page.
     */
    public function show(TwoFactorAuthenticationRequest $request)
    {
        try {
            $request->ensureStateIsValid();

            return Inertia::render('settings/two-factor', [
                'twoFactorEnabled' => $request->user()->hasEnabledTwoFactorAuthentication(),
                'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
            ]);
        } catch (\Exception $e) {
            Log::error('Two Factor Auth Show Error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan memuat halaman: ' . $e->getMessage());
        }
    }
}
