import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Index({ transactions, filters, summary, monthlyReport }) {

    // 1. Inisialisasi Hook Form untuk menangkap input user
    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        amount: '',
        type: 'income',
    });

    // 2. Fungsi untuk mengirim data ke Laravel
    const submit = (e) => {
        e.preventDefault();
        post('/transactions', {
            onSuccess: () => reset(), // Form kosong lagi setelah berhasil simpan
        });
    };

    const handleDelete = (id) => {
        // Cek di console apakah ID benar-benar masuk saat tombol diklik
        console.log("ID yang akan dihapus:", id);

        if (!id) {
            alert("ID tidak terbaca!");
            return;
        }

        if (confirm(`Yakin ingin menghapus transaksi dengan ID ${id}?`)) {
            // PERHATIKAN: Gunakan backtick ( ` ) bukan ( ' ) atau ( " )
            router.delete(`/transactions/${id}`, {
                onSuccess: () => {
                    alert("Berhasil dihapus");
                },
                onError: (err) => {
                    console.error("Gagal hapus:", err);
                }
            });
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '40px', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
            <Head title="Financial Tracking" />

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1 style={{ color: '#333', textAlign: 'center' }}>My Financial Tracking</h1>

                {/* --- BAGIAN SUMMARY --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={cardStyle('#dff9fb')}>
                        <small>Total Pemasukan</small>
                        <h3 style={{ color: '#0984e3', margin: '5px 0' }}>Rp {summary.total_income.toLocaleString('id-ID')}</h3>
                    </div>
                    <div style={cardStyle('#ffebed')}>
                        <small>Total Pengeluaran</small>
                        <h3 style={{ color: '#d63031', margin: '5px 0' }}>Rp {summary.total_expense.toLocaleString('id-ID')}</h3>
                    </div>
                    <div style={cardStyle(summary.current_balance >= 0 ? '#e3fcef' : '#fff5f5')}>
                        <small>Saldo Saat Ini ({summary.status})</small>
                        <h3 style={{ color: summary.current_balance >= 0 ? '#27ae60' : '#c0392b', margin: '5px 0' }}>
                            Rp {summary.current_balance.toLocaleString('id-ID')}
                        </h3>
                    </div>
                </div>

                {/* --- 3. FORM INPUT BARU --- */}
                <div style={{ ...whiteBox, marginBottom: '30px' }}>
                    <h3 style={{ marginTop: 0 }}>Tambah Transaksi Baru</h3>
                    <form onSubmit={submit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 2 }}>
                            <input
                                type="text"
                                placeholder="Deskripsi (ex: Gaji, Jajan)"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                style={inputStyle}
                            />
                            {errors.description && <div style={errorText}>{errors.description}</div>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <input
                                type="number"
                                placeholder="Jumlah (Rp)"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                style={inputStyle}
                            />
                            {errors.amount && <div style={errorText}>{errors.amount}</div>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                style={inputStyle}
                            >
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={submitBtnStyle}
                        >
                            {processing ? '...' : 'Simpan'}
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                    {/* --- TABEL TRANSAKSI --- */}
                    <div style={whiteBox}>
                        <h3>Riwayat Transaksi</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <Link href="/transactions" style={btnStyle(!filters.type)}>Semua</Link>
                            <Link href="/transactions?type=income" style={btnStyle(filters.type === 'income')}>Pemasukan</Link>
                            <Link href="/transactions?type=expense" style={btnStyle(filters.type === 'expense')}>Pengeluaran</Link>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Deskripsi</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>
                                            {/* <b style={{color: 'red'}}>ID: {t.id}</b> | {t.description} <br /> */}
                                            <small style={{ color: '#888' }}>{t.type === 'income' ? '🟢 Pemasukan' : '🔴 Pengeluaran'}</small>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: t.type === 'income' ? '#2ecc71' : '#e74c3c' }}>
                                            {t.type === 'income' ? '+' : '-'} Rp {Number(t.amount).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- LAPORAN BULANAN --- */}
                    <div style={whiteBox}>
                        <h3>Laporan Bulanan</h3>
                        {monthlyReport.map((item, index) => (
                            <div key={index} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #ddd' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.period}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: item.type === 'income' ? '#2ecc71' : '#e74c3c' }}>
                                        {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                                    </span>
                                    <span>Rp {item.total_amount.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

// --- Tambahan Styles (Masukkan ini agar tidak error) ---
const whiteBox = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const cardStyle = (bgColor) => ({ backgroundColor: bgColor, padding: '15px', borderRadius: '12px', textAlign: 'center' });
const btnStyle = (isActive) => ({ marginRight: '8px', padding: '6px 12px', textDecoration: 'none', borderRadius: '6px', fontSize: '13px', backgroundColor: isActive ? '#3498db' : '#f0f0f0', color: isActive ? 'white' : '#555' });
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' };
const submitBtnStyle = { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const errorText = { color: '#e74c3c', fontSize: '12px', marginTop: '5px' };