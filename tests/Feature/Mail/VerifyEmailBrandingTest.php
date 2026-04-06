<?php

namespace Tests\Feature\Mail;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\App;
use Laravel\Fortify\Features;
use Tests\TestCase;

class VerifyEmailBrandingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::emailVerification());
    }

    public function test_verify_email_notification_uses_branded_views_and_palette(): void
    {
        $user = User::factory()->unverified()->create();
        $notification = new VerifyEmail;
        $mail = $notification->toMail($user);

        $this->assertIsArray($mail->view);
        $this->assertSame('emails.verify-email', $mail->view['html']);
        $this->assertSame('emails.verify-email-text', $mail->view['text']);

        $html = view($mail->view['html'], $mail->viewData)->render();

        $this->assertStringContainsString('#fff8f2', $html);
        $this->assertStringContainsString('#9f393b', $html);
        $this->assertStringContainsString('#bf5152', $html);
        $this->assertStringContainsString('linear-gradient', $html);
    }

    public function test_verify_email_subject_follows_app_locale(): void
    {
        $user = User::factory()->unverified()->create();
        $notification = new VerifyEmail;

        App::setLocale('en');
        $mailEn = $notification->toMail($user);
        $this->assertSame('Verify your email address', $mailEn->subject);

        App::setLocale('pt_BR');
        $mailPt = $notification->toMail($user);
        $this->assertSame('Confirme seu endereço de e-mail', $mailPt->subject);
    }
}
