<?php
use App\Http\Controllers\api\ArticleController;
use App\Http\Controllers\AuthController;
use App\Models\Category;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;
use App\Models\User;
use App\Http\Controllers\SliderHeadlineController;
use App\Http\Controllers\Auth\GoogleController;

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->to('https://www.situsintan.org');
});

Route::get('/articles', [ArticleController::class, 'index']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/storage/images/{filename}', [ImageController::class, 'show']);

Route::get('/googleredirect', [GoogleController::class, 'redirectToGoogle']);
Route::get('/googlecallback', [GoogleController::class, 'handleGoogleCallback']);


