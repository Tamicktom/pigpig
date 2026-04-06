<?php

namespace Tests\Support;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

final class MailpitClient
{
    public function __construct(
        private readonly string $baseUrl,
    ) {}

    public static function fromConfig(): self
    {
        $base = rtrim(config('services.mailpit.api_url', env('MAILPIT_API_URL', 'http://127.0.0.1:8025')), '/');

        return new self($base);
    }

    public function deleteAllMessages(): Response
    {
        return Http::baseUrl($this->baseUrl)->delete('/api/v1/messages');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listMessages(): array
    {
        $response = Http::baseUrl($this->baseUrl)->get('/api/v1/messages');

        $response->throw();

        $data = $response->json();

        return is_array($data['messages'] ?? null) ? $data['messages'] : [];
    }

    public function ping(): bool
    {
        try {
            $response = Http::baseUrl($this->baseUrl)
                ->timeout(2)
                ->get('/api/v1/info');

            return $response->successful();
        } catch (\Throwable) {
            return false;
        }
    }
}
