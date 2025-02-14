<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class SliderHeadlineController extends Controller
{
    public function index()
    {
      return $this->getSliderArticles();
    }
   
    public function setAsSlider($id)
    {
      $article = Article::findOrFail($id);
      $article->slider = true;
      $article->save();
      return response()->json(['message' => 'Article set as slider successfully'], 200);  
    }

    public function unsetSlider($id)
    {
        $article = Article::findOrFail($id);
        $article->slider = false;
        $article->save();

        return response()->json(['message' => 'Article unset as slider successfully'], 200);
    }

    public function getSliderArticles()
    {
      $sliderArticles = Article::where('slider', true)
      ->limit(8)
        ->get();
      return response()->json($sliderArticles);
    }
}