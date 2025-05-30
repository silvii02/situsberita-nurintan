<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['article_id', 'name', 'body', 'is_read'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
