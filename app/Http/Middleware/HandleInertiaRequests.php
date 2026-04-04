<?php

namespace App\Http\Middleware;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;
use Laravel\Fortify\Features;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'locale' => App::getLocale(),
            'translations' => $this->sharedJsonTranslations(),
            'name' => config('app.name'),
            'canRegister' => Features::enabled(Features::registration()),
            'auth' => [
                'user' => $request->user(),
                'needsEmailVerification' => ($user = $request->user()) instanceof MustVerifyEmail
                    && ! $user->hasVerifiedEmail(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'status' => $request->session()->get('status'),
            'success' => $request->session()->get('success'),
        ];
    }

    /**
     * Load `lang/{locale}.json` as a flat associative array for the frontend.
     *
     * @return array<string, string>
     */
    private function loadLocaleJsonTranslations(string $locale): array
    {
        $path = lang_path("{$locale}.json");

        if (! File::isFile($path)) {
            return [];
        }

        $decoded = json_decode(File::get($path), true);

        if (! is_array($decoded)) {
            return [];
        }

        /** @var array<string, string> $strings */
        $strings = [];

        foreach ($decoded as $key => $value) {
            if (is_string($key) && is_string($value)) {
                $strings[$key] = $value;
            }
        }

        return $strings;
    }

    /**
     * Merge fallback locale JSON with the active locale so missing keys still resolve.
     *
     * @return array<string, string>
     */
    private function sharedJsonTranslations(): array
    {
        $fallbackLocale = (string) config('app.fallback_locale', 'en');
        $currentLocale = App::getLocale();

        $fallback = $this->loadLocaleJsonTranslations($fallbackLocale);
        $current = $this->loadLocaleJsonTranslations($currentLocale);

        return array_merge($fallback, $current);
    }
}
