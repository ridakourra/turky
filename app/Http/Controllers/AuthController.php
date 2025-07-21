<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'cin' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->has('remember');

        if (Auth::attempt(['cin' => $credentials['cin'], 'password' => $credentials['password'], 'role' => ['directeur', 'comptable']], $remember)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'cin' => 'Invalid credentials or unauthorized role.',
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
