<?php

namespace Tests\Feature\Auth;

use App\Models\Drp;
use App\Models\Polo;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_authenticated_users_are_redirected_away_from_registration_screen(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('register'))
            ->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_registration_screen_can_be_rendered(): void
    {
        $drpA = Drp::factory()->create(['name' => 'AAA Regional']);
        $drpB = Drp::factory()->create(['name' => 'ZZZ Regional']);
        $poloA = Polo::factory()->create([
            'drp_id' => $drpA->id,
            'name' => 'Alpha Polo',
        ]);
        $poloB = Polo::factory()->create([
            'drp_id' => $drpB->id,
            'name' => 'Zebra Polo',
        ]);

        $response = $this->get(route('register'));

        $response->assertOk();

        $response->assertInertia(fn (Assert $page) => $page
            ->component('auth/register')
            ->has('polos', 2)
            ->where('polos.0.id', $poloA->id)
            ->where('polos.0.name', 'Alpha Polo')
            ->where('polos.0.drp_id', $drpA->id)
            ->where('polos.0.drp_name', 'AAA Regional')
            ->where('polos.1.id', $poloB->id)
            ->where('polos.1.name', 'Zebra Polo')
            ->where('polos.1.drp_id', $drpB->id)
            ->where('polos.1.drp_name', 'ZZZ Regional'));
    }

    public function test_new_users_can_register(): void
    {
        $drp = Drp::factory()->create();

        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+5511987654321',
            'drp_id' => $drp->id,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'phone' => '+5511987654321',
            'drp_id' => $drp->id,
        ]);
    }

    public function test_registration_sends_email_verification_notification(): void
    {
        $this->skipUnlessFortifyHas(Features::emailVerification());

        Notification::fake();

        $drp = Drp::factory()->create();

        $this->post(route('register.store'), [
            'name' => 'Verify User',
            'email' => 'verify@example.com',
            'phone' => '+5511987654321',
            'drp_id' => $drp->id,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::query()->where('email', 'verify@example.com')->first();

        $this->assertNotNull($user);
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_registration_fails_without_drp_id(): void
    {
        Drp::factory()->create();

        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+5511987654321',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('drp_id');
        $this->assertGuest();
    }

    public function test_registration_fails_without_phone(): void
    {
        $drp = Drp::factory()->create();

        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'drp_id' => $drp->id,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('phone');
        $this->assertGuest();
    }

    public function test_registration_fails_with_invalid_drp_id(): void
    {
        Drp::factory()->create();

        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+5511987654321',
            'drp_id' => 999_999,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('drp_id');
        $this->assertGuest();
    }

    public function test_registration_fails_when_drp_is_soft_deleted(): void
    {
        $drp = Drp::factory()->create();
        $drp->delete();

        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+5511987654321',
            'drp_id' => $drp->id,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('drp_id');
        $this->assertGuest();
    }

    public function test_registration_fails_with_invalid_phone_format(): void
    {
        $drp = Drp::factory()->create();

        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '123',
            'drp_id' => $drp->id,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('phone');
        $this->assertGuest();
    }

    public function test_registration_fails_with_phone_containing_invalid_characters(): void
    {
        $drp = Drp::factory()->create();

        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => 'call-me-maybe',
            'drp_id' => $drp->id,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('phone');
        $this->assertGuest();
    }
}
