<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request){
        //filter dan list transaksi
        $type = $request->query('type');
        $transactions = $type
            ? Transaction::where('type', $type)->orderBy('created_at','desc')->get()
            : Transaction::orderBy('created_at','desc')->get();

        //summary
        $totalIncome = Transaction::where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        //laporan
        $report = Transaction::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, type, SUM(amount) as total')
            ->groupBy('year', 'month', 'type')
            ->orderBy('year','desc')
            ->orderBy('month','desc')
            ->get();

        $formattedReport = $report->map(function ($item){
            return [
               'period' =>date('F Y', mktime(0, 0 , 0, $item->month, 1, $item->year)),
                'type'=>$item->type,
                'total_amount' => (float) $item->total];
       });
       return Inertia::render('Transaction/Index', [
        'transactions'=> $transactions,
        'filters' => $request->only(['type']),
        'summary' => [
            'total_income' => (float) $totalIncome,
            'total_expense' => (float) $totalExpense,
            'current_balance' => (float) $balance,
            'status' => $balance < 0?'Defisit':'Surplus'],
            'monthlyReport' => $formattedReport
        ]);
    }
    // public function index(Request $request){
    //     $type = $request->query('type');

    //     if ($type){
    //         $transactions = Transaction::where('type', $type)->get();
    //     }
    //     else{
    //         $transactions = Transaction::all();
    //     }

    //     return Inertia::render('Transaction/Index', [
    //         'transactions'=> $transactions,
    //         'filters' => $request->only(['type'])
    //         ]);
    // }
    // public function store(Request $request){
    //     $validated =$request->validate([
    //         'description'=> 'required|string|max:255',
    //         'amount'=> 'required|numeric|min:1',
    //         'type'=>'required|in:income,expense'
    //         ]);
    //         $transaction = Transaction::create($validated);
    //         return response()->json([
    //             'message'=> 'Transaksi berhasil dicatat!',
    //             'data'=> $transaction
    //             ], 201);
    // }

    // public function destroy($id){
    //     $transaction = Transaction::find($id);

    //     if (!$transaction) {
    //         return response()->json(['message' => 'Data Tidak Ditemukan'], 404);
    //     }
    //     $transaction->delete();
    //     return response()->json(['message'=> 'Transaksi berhasil dihapus']);

    // }
    // public function summary(){
    //     $totalIncome = Transaction::where('type','income')->sum('amount');
    //     $totalExpense = Transaction::where('type','expense')->sum('amount');
    //     $balance = $totalIncome - $totalExpense;

    //     return response()->json([
    //         'summary'=>[
    //             'total_income'=> (float) $totalIncome,
    //             'total_expense'=> (float) $totalExpense,
    //             'current_balance'=> (float) $balance,
    //             'status'=> $balance < 0?'Defisit':'Surplus'
    //         ]
    //         ]);
    // }
    // public function monthlyReport(){
    //     $report = Transaction::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, type, SUM(amount) as total')
    //         ->groupBy('year', 'month', 'type')
    //         ->orderBy('year','desc')
    //         ->orderBy('month','desc')
    //         ->get();

    //     $formattedReport = $report->map(function ($item){
    //         return [
    //             'period' =>date('F Y', mktime(0, 0 , 0, $item->month, 1, $item->year)),
    //             'type'=>$item->type,
    //             'total_amount' => (float) $item->total];
    //     });

    //     return response()->json($formattedReport);
    // }


}