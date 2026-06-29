<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'consultations.create',
            'consultations.unlimited',
            'coach.basic',
            'coach.advanced',
            'reports.export',
            'admin.access',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $user = Role::findOrCreate('user');
        $user->syncPermissions(['consultations.create', 'coach.basic']);

        $pro = Role::findOrCreate('pro');
        $pro->syncPermissions([
            'consultations.create',
            'consultations.unlimited',
            'coach.basic',
            'coach.advanced',
            'reports.export',
        ]);

        $admin = Role::findOrCreate('admin');
        $admin->syncPermissions(Permission::all());
    }
}
