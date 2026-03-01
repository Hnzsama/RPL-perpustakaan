import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fine } from '@/pages/fines/columns';
import * as React from 'react';

interface FineFormProps {
    fine?: Fine & { borrowing_id?: string };
    borrowings?: { id: string; book: { title: string }; member: { name: string } }[];
    onSuccess: () => void;
    initialBorrowingId?: string;
    initialAmount?: number;
}

export function FineForm({ fine, borrowings = [], onSuccess, initialBorrowingId, initialAmount }: FineFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        borrowing_id: fine?.borrowing_id || initialBorrowingId || (borrowings.length > 0 ? borrowings[0].id : ''),
        amount: fine?.amount || initialAmount || 0,
        payment_status: fine?.payment_status || 'unpaid',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fine) {
            put(`/fines/${fine.id}`, {
                onSuccess: () => onSuccess(),
            });
        } else {
            post('/fines', {
                onSuccess: () => onSuccess(),
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {!fine && !initialBorrowingId ? (
                <div className="space-y-2">
                    <Label htmlFor="borrowing_id">Peminjaman</Label>
                    <Select
                        value={data.borrowing_id}
                        onValueChange={(value) => setData('borrowing_id', value)}
                    >
                        <SelectTrigger id="borrowing_id">
                            <SelectValue placeholder="Pilih peminjaman" />
                        </SelectTrigger>
                        <SelectContent>
                            {borrowings.map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                    {b.book.title} - {b.member.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.borrowing_id && <p className="text-sm text-destructive">{errors.borrowing_id}</p>}
                </div>
            ) : null}
            <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Denda</Label>
                <Input
                    id="amount"
                    type="number"
                    value={data.amount}
                    onChange={(e) => setData('amount', parseFloat(e.target.value))}
                    required
                    min="0"
                />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>
            {fine && (
                <div className="space-y-2">
                    <Label htmlFor="payment_status">Status Pembayaran</Label>
                    <Select
                        value={data.payment_status}
                        onValueChange={(value) => setData('payment_status', value as any)}
                    >
                        <SelectTrigger id="payment_status">
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="unpaid">Belum Lunas</SelectItem>
                            <SelectItem value="paid">Lunas</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.payment_status && <p className="text-sm text-destructive">{errors.payment_status}</p>}
                </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={processing}>
                    {fine ? 'Simpan Perubahan' : 'Tambah Denda'}
                </Button>
            </div>
        </form>
    );
}
