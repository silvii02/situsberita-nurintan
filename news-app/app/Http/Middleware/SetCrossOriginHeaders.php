<?php 
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetCrossOriginHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Menambahkan header COOP dan COEP
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Embedder-Policy', 'require-corp');

        return $response;
    }
}
