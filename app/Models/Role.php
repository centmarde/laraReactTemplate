<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * The pages that belong to this role (used by the AuthService eager-load).
     */
    public function userRolePages(): BelongsToMany
    {
        return $this->belongsToMany(Page::class, 'role_page');
    }

    /**
     * Alias for the pages belonging to this role.
     */
    public function pages(): BelongsToMany
    {
        return $this->belongsToMany(Page::class, 'role_page');
    }
}
