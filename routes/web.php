<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return redirect('/transactions'); // Alihkan ke halaman transaksi
});

Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
Route::post('/transactions', [TransactionController::class,'store'])->name('transactions.store');
Route::delete('/transactions/{id}', [TransactionController::class,'destroy'])->name('transactions.destroy');
