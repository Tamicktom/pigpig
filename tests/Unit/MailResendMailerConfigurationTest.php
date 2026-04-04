<?php

namespace Tests\Unit;

use Tests\TestCase;

class MailResendMailerConfigurationTest extends TestCase
{
    public function test_resend_mailer_is_configured_with_resend_transport(): void
    {
        $mailers = config('mail.mailers');

        $this->assertIsArray($mailers);
        $this->assertArrayHasKey('resend', $mailers);
        $this->assertSame('resend', $mailers['resend']['transport'] ?? null);
    }

    public function test_services_config_exposes_resend_key_from_environment(): void
    {
        $this->assertArrayHasKey('resend', config('services'));
        $this->assertArrayHasKey('key', config('services.resend'));
    }
}
