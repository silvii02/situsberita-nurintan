<?php

namespace App\Models;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function articles()
        {
            return $this->hasMany(Article::class);
        }

    protected static function boot()
        {
            parent::boot();

            static::creating(function ($model) {
                if (empty($model->slug)) {
                    $model->slug = Str::slug($model->name);
                }
            });
        }
    
}