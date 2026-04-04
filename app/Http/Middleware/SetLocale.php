<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supported = config('locales.supported', []);
        $default = config('app.locale');
        $fromCookie = $request->cookie('locale');

        if (is_string($fromCookie) && in_array($fromCookie, $supported, true)) {
            App::setLocale($fromCookie);
        } else {
            App::setLocale(is_string($default) ? $default : 'en');
        }

        return $next($request);
    }
}
