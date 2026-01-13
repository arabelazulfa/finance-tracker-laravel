<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return redirect('/transactions'); // Alihkan ke halaman transaksi
});

Route::get('/transactions', [TransactionController::class, 'index']);
