<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::delete('/transactions/{id}', [TransactionController::class,'destroy']);

Route::get('/summary', [TransactionController::class,'summary']);
Route::get('/report/monthly', [TransactionController::class,'monthlyReport']);