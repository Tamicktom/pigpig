<?php

// * Libraries imports
use App\Models\User;
use Laravel\Fortify\Features;
use Tests\Support\MailpitClient;

beforeEach(function () {
    if (! filter_var(env('RUN_MAILPIT_TESTS', false), FILTER_VALIDATE_BOOLEAN)) {
        $this->markTestSkipped('Set RUN_MAILPIT_TESTS=true and start Mailpit to run this group.');
    }

    $client = MailpitClient::fromConfig();

    if (! $client->ping()) {
        $this->markTestSkipped('Mailpit API is not reachable at '.config('services.mailpit.api_url'));
    }

    config([
        'mail.default' => 'smtp',
        'mail.mailers.smtp.host' => env('MAILPIT_SMTP_HOST', '127.0.0.1'),
        'mail.mailers.smtp.port' => (int) env('MAILPIT_SMTP_PORT', 1025),
        'mail.mailers.smtp.encryption' => env('MAILPIT_SMTP_ENCRYPTION'),
        'mail.mailers.smtp.username' => env('MAILPIT_SMTP_USERNAME'),
        'mail.mailers.smtp.password' => env('MAILPIT_SMTP_PASSWORD'),
    ]);

    $client->deleteAllMessages();
});

test('password reset notification is delivered to mailpit', function () {
    if (! Features::enabled(Features::resetPasswords())) {
        $this->markTestSkipped('Fortify password reset is disabled.');
    }

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    $messages = MailpitClient::fromConfig()->listMessages();

    expect($messages)->not->toBeEmpty();

    $subjects = array_map(fn (array $m) => $m['Subject'] ?? '', $messages);

    expect($subjects)->toContain(__('Reset your password'));
})->group('mailpit');
