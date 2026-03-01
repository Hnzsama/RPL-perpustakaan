import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Borrowing } from '@/pages/borrowings/columns';
import * as React from 'react';

interface BorrowingFormProps {
    borrowing?: Borrowing & { book_id?: string; member_id?: string };
    books?: { id: string; title: string }[];
    members?: { id: string; name: string }[];
    onSuccess: () => void;
}

export function BorrowingForm({ borrowing, books = [], members = [], onSuccess }: BorrowingFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        book_id: borrowing?.book_id || (books.length > 0 ? books[0].id : ''),
        member_id: borrowing?.member_id || (members.length > 0 ? members[0].id : ''),
        borrow_date: borrowing?.borrow_date || new Date().toISOString().split('T')[0],
        due_date: borrowing?.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: borrowing?.status || 'borrowed',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (borrowing) {
            put(`/borrowings/${borrowing.id}`, {
                onSuccess: () => onSuccess(),
            });
        } else {
            post('/borrowings', {
                onSuccess: () => onSuccess(),
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {!borrowing ? (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="book_id">Buku</Label>
                        <Select
                            value={data.book_id}
                            onValueChange={(value) => setData('book_id', value)}
                        >
                            <SelectTrigger id="book_id">
                                <SelectValue placeholder="Pilih buku" />
                            </SelectTrigger>
                            <SelectContent>
                                {books.map((book) => (
                                    <SelectItem key={book.id} value={book.id}>
                                        {book.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.book_id && <p className="text-sm text-destructive">{errors.book_id}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="member_id">Anggota</Label>
                        <Select
                            value={data.member_id}
                            onValueChange={(value) => setData('member_id', value)}
                        >
                            <SelectTrigger id="member_id">
                                <SelectValue placeholder="Pilih anggota" />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.member_id && <p className="text-sm text-destructive">{errors.member_id}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="borrow_date">Tgl Pinjam</Label>
                            <Input
                                id="borrow_date"
                                type="date"
                                value={data.borrow_date}
                                onChange={(e) => setData('borrow_date', e.target.value)}
                                required
                            />
                            {errors.borrow_date && <p className="text-sm text-destructive">{errors.borrow_date}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Batas Kembali</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                required
                            />
                            {errors.due_date && <p className="text-sm text-destructive">{errors.due_date}</p>}
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value as any)}
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="borrowed">Dipinjam</SelectItem>
                            <SelectItem value="returned">Dikembalikan</SelectItem>
                            <SelectItem value="overdue">Terlambat</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={processing}>
                    {borrowing ? 'Perbarui Status' : 'Tambah Peminjaman'}
                </Button>
            </div>
        </form>
    );
}
