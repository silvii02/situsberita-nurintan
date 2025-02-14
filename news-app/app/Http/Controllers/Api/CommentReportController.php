<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentReportController extends Controller
{
    // Get all comments
    public function index()
    {
        $comments = Comment::with('article:id,title')->latest()->get();
        return response()->json($comments);
    }

    // Delete a comment
    public function destroy($id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }

    // Update a comment
    public function update(Request $request, $id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $comment->update([
            'name' => $request->name,
            'body' => $request->body,
        ]);

        return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment]);
    }

    // ini utk notifnya
    public function unreadCount()
        {
            $count = Comment::where('is_read', false)->count();
            return response()->json(['unread_comments' => $count]);
        }
        public function markAllAsRead()
        {
            Comment::where('is_read', false)->update(['is_read' => true]);
            return response()->json(['message' => 'Komen telah dibaca']);
        }

}