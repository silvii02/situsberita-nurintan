<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class CategoryController extends Controller
{
    public function getArticlesByCategory($slug) {
        $category = Category::where('slug', $slug)->firstOrFail();
        $articles = $category->articles()->get();
        return response()->json($articles);
    }

    public function store(Request $request)
            {
                $validatedData = $request->validate([
                    'name' => 'required|string|max:255',
                ]);
                $category = Category::create($validatedData);
                return response()->json($category, 201);
            }

            public function destroy($id)
{
    // Start a transaction
    DB::beginTransaction();

    try {
        // Find the category
        $category = Category::findOrFail($id);

        // If you have a relationship, delete related records first
        // For example, if you have a Post model that references Category
        // Post::where('category_id', $id)->delete();

        // Delete the category
        $category->delete();

        // Commit the transaction
        DB::commit();
        
        return response()->json(['message' => 'Category deleted successfully.'], 200);
    } catch (\Exception $e) {
        // Rollback the transaction if something goes wrong
        DB::rollBack();
        
        return response()->json(['error' => 'Failed to delete category: ' . $e->getMessage()], 500);
    }
}

public function update(Request $request, $id)
{
    $category = Category::find($id);
    
    if (!$category) {
        return response()->json(['message' => 'Category not found'], 404);
    }

    $category->name = $request->input('name');
    $category->save();

    return response()->json($category, 200);
}

}
