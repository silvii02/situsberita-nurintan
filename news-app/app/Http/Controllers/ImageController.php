<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function show($filename)
    {
        $path = storage_path('app/public/images/' . $filename);
    
        if (!file_exists($path)) {
            abort(404);
        }
    
        return response()->file($path);
    }

    
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            $articleId = $request->get('article_id', null);
            $imageName = $articleId ? Str::slug($request->get('title'), '-') . '-' . $articleId . '.' . $image->getClientOriginalExtension() : $image->getClientOriginalName();
            $imagePath = $image->store('images', 'public');
            $imageUrl = Storage::url($imagePath);
            return response()->json(['image_url' => $imageUrl]);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }
}