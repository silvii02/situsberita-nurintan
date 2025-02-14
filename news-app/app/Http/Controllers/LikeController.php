<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Services\SessionService;
use Illuminate\Http\Request;

class LikeController extends Controller
{

    protected $sessionService;

    public function __construct(SessionService $sessionService) {
        $this->sessionService = $sessionService;
    }

    public function like(Request $request, $articleId) {
       
        $sessionId = $request->cookie('session_id');
        
        try {
            $like = Like::firstOrCreate(
                ['article_id' => $articleId, 
                'session_id' => $sessionId || '123'],
                ['ip_address' => $request->ip()]
            );

            return response()->json(['message' => 'Anda Liked artikel ini', 'like' => $like]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'gagal to like article ini', 'message' => $e->getMessage()], 500);
        }
    }

    public function getLikeCount($articleId)
    {
        $count = Like::where('article_id', $articleId)->count();
        return response()->json(['like_count' => $count]);
    }


}
