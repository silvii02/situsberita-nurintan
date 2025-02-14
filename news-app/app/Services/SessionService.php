<?php 

namespace App\Services;

use App\Models\Session;
use Illuminate\Support\Facades\DB;

class SessionService
{
    public function createSession($userId, $ipAddress, $userAgent) {
        $timestamp = now();
        $lastActivity = $timestamp;

        return Session::create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'timestamp' => $timestamp,
            'payload' => json_encode([]), 
            'last_activity' => $lastActivity,
            'user_agent' => $userAgent
        ]);
    }

    public function getSession($sessionId) {
        return Session::where('session_id', $sessionId)->first();
    }

    public function updateSession($sessionId) {
        Session::where('session_id', $sessionId)->update(['last_activity' => now()]);
    }

    public function deleteSession($sessionId) {
        Session::where('session_id', $sessionId)->delete();
    }

    public function isSessionExpired($sessionId) {
        $session = $this->getSession($sessionId);
        if ($session) {
            $expireTime = 2 * 60 * 60; 
            return (time() - strtotime($session->last_activity)) > $expireTime;
        }
        return true;
    }
}
