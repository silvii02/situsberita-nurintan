<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function createAdmin(Request $request)
    {
        if (auth()->user()->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);
    
        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'admin', // Secara eksplisit set role sebagai admin
        ]);
    
        return response()->json(['message' => 'Admin created successfully', 'admin' => $admin]);
    }
}