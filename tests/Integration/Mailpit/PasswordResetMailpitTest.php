<?php

namespace Tests\Integration\Mailpit;

// * Libraries imports
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use PHPUnit\Framework\Attributes\Group;
// * Tests imports
use Tests\Support\MailpitClient;
use Tests\TestCase;

#[Group('mailpit')]
class PasswordResetMailpitTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

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
    }

    public function test_password_reset_notification_is_delivered_to_mailpit(): void
    {
        $this->skipUnlessFortifyHas(Features::resetPasswords());

        $user = User::factory()->create();

        $this->post(route('password.email'), ['email' => $user->email]);

        $messages = MailpitClient::fromConfig()->listMessages();

        $this->assertNotEmpty($messages);

        $subjects = array_map(fn (array $m) => $m['Subject'] ?? '', $messages);

        $this->assertContains(__('Reset your password'), $subjects);
    }
}
