<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Transaction extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'transactions';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'description',
        'image_path',
    ];

    /**
     * The users that belong to this transaction (many-to-many via transaction_user pivot).
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'transaction_user');
    }

    /**
     * The transaction-user pivot records associated with this transaction.
     */
    public function transactionUsers(): HasMany
    {
        return $this->hasMany(TransactionUser::class);
    }
}
