<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'session_id',
        'ip_address',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
