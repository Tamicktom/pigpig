<?php

namespace Tests\Unit\Resend;

// * Libraries imports
use Illuminate\Mail\SentMessage;
use Illuminate\Support\Facades\Mail;
use PHPUnit\Framework\Attributes\Group;
use Symfony\Component\Mime\Email;
// * Tests imports
use Tests\TestCase;

/**
 * Opt-in live send against the Resend API. Does not run in CI or the default suite unless enabled.
 *
 * Lives under Unit (not Integration) so Pest does not apply RefreshDatabase — avoids teardown issues
 * after a real HTTP send while the DB test transaction is still active.
 *
 * Run (example):
 * RUN_RESEND_LIVE_TESTS=1 RESEND_LIVE_TEST_TO=you@gmail.com php artisan test --compact --group=resend-live
 *
 * Requires: RESEND_API_KEY, RESEND_LIVE_TEST_TO, and a From address on a domain verified in Resend.
 * Use RESEND_LIVE_TEST_FROM=noreply@your-verified-domain.com when MAIL_FROM_ADDRESS is still Mailpit (e.g. hello@example.com).
 */
#[Group('resend-live')]
class ResendLiveSendTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! filter_var(env('RUN_RESEND_LIVE_TESTS', false), FILTER_VALIDATE_BOOLEAN)) {
            $this->markTestSkipped(
                'Set RUN_RESEND_LIVE_TESTS=true, RESEND_API_KEY, a verified-domain From address, and RESEND_LIVE_TEST_TO to run this test.'
            );
        }

        $apiKey = (string) env('RESEND_API_KEY', '');

        if ($apiKey === '') {
            $this->markTestSkipped('RESEND_API_KEY is required for the live Resend send test.');
        }

        $to = (string) env('RESEND_LIVE_TEST_TO', '');

        if ($to === '' || ! filter_var($to, FILTER_VALIDATE_EMAIL)) {
            $this->markTestSkipped('Set RESEND_LIVE_TEST_TO to a valid recipient email address.');
        }

        $fromOverride = trim((string) env('RESEND_LIVE_TEST_FROM', ''));
        $fromAddress = $fromOverride !== '' && filter_var($fromOverride, FILTER_VALIDATE_EMAIL)
            ? $fromOverride
            : (string) config('mail.from.address', '');

        if ($fromAddress === '' || ! filter_var($fromAddress, FILTER_VALIDATE_EMAIL)) {
            $this->markTestSkipped(
                'Set MAIL_FROM_ADDRESS or RESEND_LIVE_TEST_FROM to an address on a domain verified at https://resend.com/domains.'
            );
        }

        $fromHost = strtolower((string) (explode('@', $fromAddress, 2)[1] ?? ''));

        if ($fromAddress === 'hello@example.com' || $fromHost === 'example.com') {
            $this->markTestSkipped(
                'Resend rejects the example.com domain. Set RESEND_LIVE_TEST_FROM (e.g. noreply@your-verified-domain.com) or MAIL_FROM_ADDRESS to a verified domain; keep hello@example.com for Mailpit only.'
            );
        }

        config([
            'mail.default' => 'resend',
            'mail.from.address' => $fromAddress,
            'services.resend.key' => $apiKey,
        ]);

        Mail::purge();
    }

    public function test_sends_plain_text_email_via_resend(): void
    {
        $recipient = (string) env('RESEND_LIVE_TEST_TO');

        $sent = Mail::raw(
            "This is an automated live send test from Pigpig (ResendLiveSendTest).\n\nTimestamp: ".now()->toIso8601String(),
            function ($message) use ($recipient): void {
                $message->to($recipient)
                    ->subject('Pigpig - Resend live send test');
            }
        );

        $this->assertInstanceOf(SentMessage::class, $sent);

        $original = $sent->getOriginalMessage();

        $this->assertInstanceOf(Email::class, $original);
        $this->assertTrue(
            $original->getHeaders()->has('X-Resend-Email-ID'),
            'Resend transport should attach X-Resend-Email-ID after a successful API response.'
        );
    }
}
