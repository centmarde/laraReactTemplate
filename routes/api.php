<?php

use App\Http\Controllers\Api\TasksController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('tasks', TasksController::class);
//Route::get('/tasks', [TasksController::class, 'index']);
// Route::get('/tasks', function () {
//     return 'hello world';
// });


