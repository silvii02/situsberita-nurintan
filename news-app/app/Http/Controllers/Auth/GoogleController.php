<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
// use Laravel\Socialite\Facades\Socialite;
use Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function handleGoogleCallback(Request $request)
    {
        // Validasi request apakah memiliki token
        if (!$request->has('token')) {
            return response()->json(['error' => 'Token is missing'], 400);
        }
        
        try {
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($request->token);
            $useremail = User::where('email', $googleUser->getEmail())->first();
            
            if (!$useremail) {
                return response()->json(['error' => 'Email not registered'], 403);
            }

            
            $user = User::where('google_id', $googleUser->id)->first();

        if (!$user) {
                return response()->json(['status' => 'user_not_found'], 404);
            
        }else{
            $user = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'password' => null, 
         ]);
    }

            $user->update([
                'google_id' => $googleUser->getId(),
                'name' => $googleUser->getName(),
            ]);
    
            $token = $user->createToken('authToken')->plainTextToken;
    
            return response()->json(['token' => $token, 'user' => $user]);
        } catch (\Exception $e) {
            // Tangkap error yang muncul
            return response()->json(['error' => 'Error occurred: ' . $e->getMessage()], 500);
        }
    }
    
};    