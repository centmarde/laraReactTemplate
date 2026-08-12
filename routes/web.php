<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Serve the SPA for any other path so the React BrowserRouter routes
// (e.g. /login, /register, /dashboard) work on refresh / deep links.
// Route::fallback only matches when nothing else matched, so it never
// shadows the /api/* or other registered routes.
Route::fallback(function () {
    return view('welcome');
});
