<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'article_id' => 'required|exists:articles,id',
            'name' => 'required|string|max:255',
            'body' => 'required|string|max:500',
        ]);

        Comment::create([
            'article_id' => $request->article_id,
            'name' => $request->name,
            'body' => $request->body,
        ]);

        return response()->json(['message' => 'Komentar berhasil disimpan!']);
    }

    public function index($articleId)
    {
        // Pastikan $articleId yang diterima valid
        if (!is_numeric($articleId)) {
            return response()->json(['message' => 'Invalid article ID'], 400);
        }
    
        try {
            $comments = Comment::where('article_id', $articleId)->get();
            return response()->json($comments);
        } catch (\Exception $e) {
            // Log error dan kembalikan response error 500
            \Log::error('Error fetching comments: '.$e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }
    public function getUnreadComments() {
        $unreadComments = Comment::where('is_read', false)->get();
        return response()->json($unreadComments);
    }
    
    public function markAllRead() {
        Comment::where('is_read', false)->update(['is_read' => true]);
        return response()->json(['message' => 'Semua komentar telah ditandai sebagai dibaca']);
    }

}
