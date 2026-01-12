<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(){
        $transactions = Transaction::all();
        return response()->json($transactions);
    }
    public function store(Request $request){
        $validated =$request->validate([
            'description'=> 'required|string|max:255',
            'amount'=> 'required|numeric|min:1',
            'type'=>'required|in:income,expense'
            ]);
            $transaction = Transaction::create($validated);
            return response()->json([
                'message'=> 'Transaksi berhasil dicatat!',
                'data'=> $transaction
                ], 201);
}

    public function destroy($id){
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Data Tidak Ditemukan'], 404);
        }
        $transaction->delete();
        return response()->json(['message'=> 'Transaksi berhasil dihapus']);

    }

}