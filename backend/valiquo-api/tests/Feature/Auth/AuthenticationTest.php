<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_users_can_register_and_fetch_profile(): void
    {
        $this->post('/register', [
            'first_name' => 'Youssef',
            'last_name' => 'El Amrani',
            'email' => 'youssef@valiquo.ma',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'city' => 'Casablanca',
        ])->assertNoContent();

        $this->assertAuthenticated();

        $this->get('/api/user')
            ->assertSuccessful()
            ->assertJsonPath('email', 'youssef@valiquo.ma')
            ->assertJsonPath('first_name', 'Youssef')
            ->assertJsonPath('roles.0', 'user');
    }

    public function test_users_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'sara@valiquo.ma',
            'password' => 'password123',
        ]);
        $user->assignRole('user');

        $this->post('/login', [
            'email' => 'sara@valiquo.ma',
            'password' => 'password123',
        ])->assertNoContent();

        $this->get('/api/user')
            ->assertSuccessful()
            ->assertJsonPath('email', 'sara@valiquo.ma');
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->post('/logout')->assertNoContent();
    }
}
