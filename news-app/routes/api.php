<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\CommentController;


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Category;
use App\Http\Controllers\GoogleTrendsController;
use App\Models\Article;
use App\Models\User;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\SliderHeadlineController;
use App\Http\Controllers\LikeController;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\GoogleController;
use Google\Client as Google_Client;
use App\Http\Controllers\Api\CommentReportController;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;


$client = new \Google_Client();
Route::post('/googleredirect', function (Request $request) {
    try {

        $client = new Google_Client([
            "client_id" => "1063218490939-j8eil2n0fa30d22clleboevpmcaugrg8.apps.googleusercontent.com"
        ]);

        $payload = $client->verifyIdToken($request->input('token'));

        if (!$payload) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $user = User::updateOrCreate(
            ['email' => $payload['email']],
            ['name' => $payload['name'], 'google_id' => $payload['sub']]
            
        );

        $token = $user->createToken('authToken')->plainTextToken;
        return response()->json(['token' => $token, "user" => $user]);

    } catch (Exception $e) {
        Log::error('Google login error:', ['message' => $e->getMessage()]);
        return response()->json(['error' => 'Something went wrong'], 500);
    }
});

// Rute yang memerlukan otentikasi
Route::middleware('auth:sanctum')->group(function () {
   Route::put('articles/{id}', [ArticleController::class, 'update']); 
   Route::post('/articles', [ArticleController::class, 'store']);
   Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
   Route::post('/articles/{id}/set-headline', [ArticleController::class, 'setHeadline']);
   Route::post('/articles/{id}/unset-headline', [ArticleController::class, 'unsetHeadline']);
   Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
   Route::put('/categories/{id}', [CategoryController::class, 'update']);
   Route::post('/create-admin', [UserController::class, 'createAdmin']);
    Route::get('/user', function (Request $request) {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'role' => $request->user()->role, // Pastikan kolom role ada di tabel users
        ]);
    });
   
});
Route::post('/checktitle', [ArticleController::class, 'checkTitle']);


// Rute publik
Route::post('/login', [AuthController::class, 'login']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('articles/{id}', [ArticleController::class, 'show']);
Route::post('/createcategory', [CategoryController::class, 'store']);
Route::get('/articleSlider', [SliderHeadlineController::class, 'getSliderArticles']);
Route::get('categories', function() {
    return Category::all(); 
});


// ini utk bikin artikel terkait
Route::get('articles/related/{category_id}/{current_article_id}', [ArticleController::class, 'getRelatedArticles']);

// ini utk bikin list artikel dalam 1 kategori 
Route::get('/categories/{slug}/articles', [CategoryController::class, 'getArticlesByCategory']);

// ini utuk bikin artikel terkait
Route::get('articles/related/{category_id}/{current_article_id}', [ArticleController::class, 'getRelatedArticles']);

Route::post('upload-image', [ImageController::class, 'uploadImage']);
Route::get('/trends', [GoogleTrendsController::class, 'getTrends']);
Route::get('articlespop', [ArticleController::class, 'getPopularArticles']);
Route::get('/search', [ArticleController::class, 'search']);
Route::get('articlestoptags', [ArticleController::class, 'getTopTagArticles']);
Route::get('/tag/{tagName}', [ArticleController::class, 'getArticlesByTag']);
Route::post('/comments', [CommentController::class, 'store']);
Route::get('/articles/{id}/comments', [CommentController::class, 'index']);
Route::get('/check-session', [AuthController::class, 'checkSession']);
Route::post('/articles/{articleId}/like', [LikeController::class, 'like']);
Route::get('/articles/{articleId}/likes', [LikeController::class, 'getLikeCount']);
Route::get('/commentsreport', [CommentReportController::class, 'index']);
Route::delete('/commentsreport/{id}', [CommentReportController::class, 'destroy']);
Route::put('/commentsreport/{id}', [CommentReportController::class, 'update']);
Route::get('/commentsreport/unread-count', [CommentReportController::class, 'unreadCount']);
Route::post('/commentsreport/mark-all-read', [CommentReportController::class, 'markAllAsRead']);

Route::get('/storage/images/{filename}', [ImageController::class, 'show']);

