<?php
// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
// use App\Models\User;
// use Illuminate\Validation\ValidationException;

// class AuthController extends Controller
// {
    /**
     * Handle the login request
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
//     public function login(Request $request)
//     {
//         $credentials = $request->only('email', 'password');

//         if (!Auth::attempt($credentials)) {
//             throw ValidationException::withMessages([
//                 'email' => ['The provided credentials are incorrect.'],
//             ]);
//         }

//         $user = Auth::user();
//         $token = $user->createToken('Personal Access Token')->plainTextToken;

//         return response()->json([
//             'token' => $token,
//             'user' => $user
//         ]);
//     }
// }


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }
    
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email', // Validasi email
            'old_password' => 'required',
            'new_password' => 'required|confirmed|min:6', // Pastikan password baru sama dan minimal 6 karakter
        ]);
    
        // Cek apakah user ada dan emailnya cocok
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Email atau password lama tidak cocok.'], 401);
        }
    
        // Jika validasi berhasil, update password
        $user->password = Hash::make($request->new_password);
        $user->save();
    
        return response()->json(['message' => 'Password berhasil direset.']);
    }

}
