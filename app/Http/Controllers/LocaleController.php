<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLocaleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cookie;

class LocaleController extends Controller
{
    private const int LOCALE_COOKIE_MINUTES = 60 * 24 * 365;

    public function update(UpdateLocaleRequest $request): RedirectResponse
    {
        $locale = $request->validated('locale');

        Cookie::queue('locale', $locale, self::LOCALE_COOKIE_MINUTES);

        return redirect()->back();
    }
}
