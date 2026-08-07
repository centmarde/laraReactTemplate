<?php

use App\Http\Controllers\Api\TasksController;
use App\Http\Controllers\Api\TransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionUserController;
use App\Http\Controllers\Api\UserContoller;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
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
