<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class TrustProxiesTest extends TestCase
{
    public function test_request_is_secure_when_proxy_sends_forwarded_proto(): void
    {
        Route::get('/__trust_proxy_probe', function (Request $request) {
            return response()->json([
                'secure' => $request->secure(),
            ]);
        });

        $response = $this->withHeaders([
            'X-Forwarded-Proto' => 'https',
        ])->get('/__trust_proxy_probe');

        $response->assertOk();
        $response->assertJson([
            'secure' => true,
        ]);
    }
}
