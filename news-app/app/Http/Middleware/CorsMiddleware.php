<?php

// app/Http/Middleware/CorsMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
    
        // Menambahkan header untuk Cross-Origin-Opener-Policy dan Cross-Origin-Embedder-Policy
        $response->headers->set('Cross-Origin-Opener-Policy', '*');
        $response->headers->set('Cross-Origin-Embedder-Policy', '*');
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:3000', 'https://accounts.google.com'); // Ganti dengan origin frontend kamu
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
        return $response;
    }
    
}