<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ad;
use Illuminate\Support\Facades\Storage;

class AdController extends Controller
{
    // *1. Menampilkan Semua Iklan*
    public function index()
    {
        return response()->json(Ad::where('status', 'active')->get());
    }

    // *2. Menambahkan Iklan Baru*
    public function store(Request $request)
    {
        $request->validate([
            'advertiser_name' => 'required',
            'ad_message' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'link' => 'required|url',
            'position' => 'required|in:header,footer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        // Simpan gambar di storage
        $imagePath = $request->file('image')->store('ads', 'public');

        Ad::create([
            'advertiser_name' => $request->advertiser_name,
            'ad_message' => $request->ad_message,
            'image' => $imagePath,
            'link' => $request->link,
            'position' => $request->position,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'active',
        ]);

        return response()->json(['message' => 'Iklan berhasil ditambahkan'], 201);
    }

    // *3. Menghapus Iklan*
    public function destroy($id)
    {
        $ad = Ad::findOrFail($id);
        
        // Ubah status menjadi 'inactive' bukan menghapus
        $ad->status = 'inactive';
        $ad->save();
    
        return response()->json(['message' => 'Iklan berhasil dinonaktifkan']);
    }
    
    public function update(Request $request, $id)
{
    $ad = Ad::findOrFail($id);

    $request->validate([
        'advertiser_name' => 'required',
        'ad_message' => 'nullable|string',
        'link' => 'required|url',
        'position' => 'required|in:header,footer',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    if ($request->hasFile('image')) {
        Storage::delete('public/' . $ad->image);
        $imagePath = $request->file('image')->store('ads', 'public');
        $ad->image = $imagePath;
    }

    $ad->update([
        'advertiser_name' => $request->advertiser_name,
        'ad_message' => $request->ad_message,
        'link' => $request->link,
        'position' => $request->position,
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
    ]);

    return response()->json(['message' => 'Iklan berhasil diperbarui']);
}

}