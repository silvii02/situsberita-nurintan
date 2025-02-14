<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $table = 'sessions'; // Nama tabel
    protected $fillable = ['user_id', 'ip_address', 'timestamp', 'payload', 'last_activity', 'user_agent'];
}
