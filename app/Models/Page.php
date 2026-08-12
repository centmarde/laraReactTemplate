<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Page extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'route',
    ];

    /**
     * The roles that are allowed to access this page.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_page');
    }
}
