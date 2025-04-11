<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    use HasFactory;

    protected $table = 'ads'; // Nama tabel di database

    protected $fillable = [
        'advertiser_name', 'ad_message', 'image', 'link', 'position', 'start_date', 'end_date', 'status'
    ];
}