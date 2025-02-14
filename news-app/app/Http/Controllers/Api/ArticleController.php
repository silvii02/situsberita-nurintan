<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::orderBy('created_at', 'desc')->get();
        return response()->json($articles);
    }

    public function updateViews($id)
    {
        $article = Article::find($id);

        if ($article) {
            $article->increment('views');
            return response()->json($article);
        }

        return response()->json(['error' => 'Article not found'], 404);
    }

    public function show($id)
{
    $article = Article::find($id);

    if (!$article) {
        return response()->json(['message' => 'Article not found'], 404);
    }

    // Cek apakah user login
    $user = auth('sanctum')->user(); // Ini memeriksa apakah ada token login dan mengambil data user

    // Jika user tidak login (guest), views akan bertambah
    if (!$user) {
        $article->increment('views'); // Tambah views hanya jika user tidak login
    }

    return response()->json($article); // Kirim data artikel beserta views yang sudah terupdate
}

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'title' => 'required|string|max:255',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'body' => 'required|string',
        'category_id' => 'required|integer|exists:categories,id',
        'author_id' => 'required|integer|exists:users,id',
        'views' => 'nullable|integer',
        'slug' => 'nullable|string|unique:articles,slug',
        'tags' => 'nullable|string',
        'linkVidio' => 'nullable|string',
    ]);

    $user = User::findOrFail($request->author_id);
    $validatedData['author_name'] = $user->name;

    // Generate unique slug jika slug tidak diisi
    if (!$request->filled('slug')) {
        $validatedData['slug'] = Str::slug($request->title, '-');

        // Tambahkan suffix angka jika slug sudah ada
        $slugBase = $validatedData['slug'];
        $counter = 1;
        while (Article::where('slug', $validatedData['slug'])->exists()) {
            $validatedData['slug'] = $slugBase . '-' . $counter++;
        }
    }

    $article = Article::create($validatedData);

    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = Str::slug($request->title, '-') . '-' . $article->id . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs('images', $imageName, 'public');
        $article->update(['image_url' => '/storage/' . $path]);
    }

    return response()->json($article, 201);
}

    public function getPopularArticles()
    {
        $articles = Article::orderBy('views', 'desc')->limit(10)->get();
        if ($articles->isEmpty()) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return response()->json($articles);
    }

    public function getRelatedArticles($category_id, $current_article_id)
    {
        $articles = Article::where('category_id', $category_id)
                            ->where('id', '!=', $current_article_id)
                            ->orderBy('created_at', 'desc')
                            ->take(8)
                            ->get();

       return response()->json($articles);
   }

   public function destroy($id)
   {
       Article::destroy($id);
       return response()->json(null, 204);
   }

   public function update(Request $request, $id)
   {
       $article = Article::findOrFail($id);
       $validatedData = $request->validate([
           'title' => 'required|string|max:255',
           'body' => 'required|string',
           'category_id' => 'required|exists:categories,id',
           'tags' => 'nullable|string',
           'author_id' => 'required|integer|exists:users,id',
           'slug' => 'nullable|string|unique:articles,slug,'.$article->id,
           'views' => 'nullable|integer',
           'linkVidio' => 'nullable|string',
           'image_url' => 'nullable|string',
       ]);

       // Update image only if provided
       if ($request->hasFile('image')) {
           $image = $request->file('image');
           $imageName = Str::slug($request->title, '-') . '-' . $article->id . '.' . $image->getClientOriginalExtension();
           $path = $image->storeAs('images', $imageName, 'public');
           $validatedData['image_url'] = '/storage/' . $path;
       }

       $article->update($validatedData);
       return response()->json($article, 200);
   }

   public function search(Request $request)
   {
       $request->validate(['query' => 'required|string|min:3']);
       $query = $request->input('query');

       try {
           $results = Article::where('title', 'LIKE', "%{$query}%")->get();
           return response()->json($results);
       } catch (\Exception $e) {
           \Log::error($e->getMessage());
           return response()->json(['message' => 'Internal Server Error'], 500);
       }
   }

   public function getTopTagArticles()
   {
       $articles = Article::select('id', 'title', 'tags', 'image_url', 'slug', 'views', 'created_at')
           ->whereNotNull('tags')
           ->orderBy(Article::raw('LENGTH(tags) - LENGTH(REPLACE(tags, ",", ""))'), 'DESC')
           ->limit(5)
           ->get();

       return response()->json($articles);
   }

   public function getArticlesByTag($tagName)
   {
       $tags = explode('-', $tagName);
       $articles = Article::where(function($query) use ($tags) {
           foreach ($tags as $tag) {
               $query->orWhere('tags', 'like', "%{$tag}%");
           }
       })->get();

       return response()->json($articles);
   }

   public function setHeadline($id)
   {
       try {
           $article = Article::findOrFail($id);
           $article->slider = 1;
           $article->save();

           return response()->json([
               'message' => 'Article set as headline successfully!',
               'article' => $article
           ], 200);
       } catch (ModelNotFoundException $e) {
           return response()->json(['message' => 'Article not found!'], 404);
       } catch (\Exception $e) {
           return response()->json(['message' => 'Error setting article as headline', 'error' => $e->getMessage()], 500);
       }
   }

   public function unsetHeadline($id)
   {
       try {
           $article = Article::findOrFail($id);
           $article->slider = 0;
           $article->save();

           return response()->json([
               'message' => 'Article unset as headline successfully!',
               'article' => $article
           ], 200);
       } catch (ModelNotFoundException $e) {
           return response()->json(['message' => 'Article not found!'], 404);
       } catch (\Exception $e) {
           return response()->json(['message' => 'Error unsetting article as headline', 'error' => $e->getMessage()], 500);
       }
   }

   public function checkTitle(Request $request)
   {
       // Mengambil title dari body request
       $title = $request->input('title');

       // Mengecek apakah judul sudah ada di database
       $exists = Article::where('title', $title)->exists();

       // Mengembalikan response dalam format JSON
       return response()->json(['exists' => $exists]);
   }
}
