<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Fungsi untuk menambahkan admin baru
    public function store(Request $request)
    {
        // Cek apakah user yang login adalah superadmin
        if (Auth::user()->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        // Buat admin baru
        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin', // Role admin
        ]);

        return response()->json(['message' => 'Admin berhasil ditambahkan', 'admin' => $admin]);
 }
}
