<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trending extends Model
{
    use HasFactory;

    protected $table = 'trending';

    protected $fillable = [
        'article_id',
        'views_count',
        'trending_score',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}