<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
class transactions extends Model
{
     use HasFactory, Notifiable;
    protected $table = 'transactions';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'image_path',
    ];
}
