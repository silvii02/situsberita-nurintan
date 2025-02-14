<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GoogleTrendsController extends Controller
{
    public function getTrends()
    {
        $url = 'https://trends.google.co.id/trending/rss?geo=ID';

        try {
            $response = Http::get($url);

            if ($response->successful()) {
                return response($response->body(), 200)
                    ->header('Content-Type', 'application/xml');
            } else {
                return response()->json(['error' => 'Gagal mengambil data dari Google Trends'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
