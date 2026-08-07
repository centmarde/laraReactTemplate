<?php

use App\Http\Controllers\Api\TasksController;
use App\Http\Controllers\Api\TransactionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Route::apiResource('tasks', TasksController::class);
Route::get('/tasks', [TasksController::class, 'index']);
Route::post('/tasks', [TasksController::class, 'store']);
Route::get('/tasks/{task}', [TasksController::class, 'show']);
Route::put('/tasks/{task}', [TasksController::class, 'update']);
Route::delete('/tasks/{task}', [TasksController::class, 'destroy']);


//Route::apiResource('transactions', TransactionsController::class);
Route::get('/transactions', [TransactionsController::class, 'index']);
Route::post('/transactions', [TransactionsController::class, 'create']);
Route::get('/transactions/{transaction}', [TransactionsController::class, 'show']);
Route::put('/transactions/{transaction}', [TransactionsController::class, 'update']);
Route::delete('/transactions/{transaction}', [TransactionsController::class, 'destroy']);
