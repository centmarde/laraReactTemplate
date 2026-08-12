<?php

use App\Http\Controllers\Api\TasksController;
use App\Http\Controllers\Api\TransactionsController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\VerifyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionUserController;
use App\Http\Controllers\Api\UserContoller;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public authentication routes.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes.
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify/email', [VerifyController::class, 'email_code']);
    Route::post('/verify/sms', [VerifyController::class, 'sms_code']);
    Route::post('/forgot-password', [PasswordController::class, 'forgot']);
    Route::post('/reset-password', [PasswordController::class, 'reset']);
});

// Route::controller(TasksController::class)->group(function () {
//     Route::get('/tasks', 'index');
//     Route::post('/tasks', 'store');
//     Route::get('/tasks/{task}', 'show');
//     Route::put('/tasks/{task}', 'update');
//     Route::delete('/tasks/{task}', 'destroy');
// });

// Route::controller(TransactionsController::class)->group(function () {
//     Route::get('/transactions', 'index');
//     Route::post('/transactions', 'store');
//     Route::get('/transactions/{transaction}', 'show');
//     Route::put('/transactions/{transaction}', 'update');
//     Route::delete('/transactions/{transaction}', 'destroy');
// });

Route::apiResource('tasks', TasksController::class);
Route::apiResource('transactions', TransactionsController::class);
Route::apiResource('transaction-users', TransactionUserController::class);
Route::apiResource('users', UserContoller::class);
