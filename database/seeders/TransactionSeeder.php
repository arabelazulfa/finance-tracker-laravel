<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Transaction::create([
            'description'=>'Gaji Bulanan',
            'amount'=> '7000000',
            'type'=> 'income',
        ]);
        Transaction::create([
            'description'=> 'Project Freelance',
            'amount'=> '1500000',
            'type'=> 'income',
        ]);
        Transaction::create([
            'description'=> 'Bayar Kost',
            'amount'=> '500000',
            'type'=> 'expense',
        ]);
        Transaction::create([
            'description'=> 'Spotify Premium',
            'amount'=> '29000',
            'type'=> 'expense',
        ]);
    }
}
