import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Book } from '@/pages/books/columns';
import * as React from 'react';

interface BookFormProps {
    book?: Book & { category_id?: string };
    categories: { id: string; name: string }[];
    onSuccess: () => void;
}

export function BookForm({ book, categories, onSuccess }: BookFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        category_id: book?.category_id || (categories.length > 0 ? categories[0].id : ''),
        title: book?.title || '',
        author: book?.author || '',
        publisher: book?.publisher || '',
        isbn: book?.isbn || '',
        year: book?.year || new Date().getFullYear(),
        stock: book?.stock || 0,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (book) {
            put(`/books/${book.id}`, {
                onSuccess: () => onSuccess(),
            });
        } else {
            post('/books', {
                onSuccess: () => onSuccess(),
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
            <div className="space-y-2">
                <Label htmlFor="category_id">Kategori</Label>
                <Select
                    value={data.category_id}
                    onValueChange={(value) => setData('category_id', value)}
                >
                    <SelectTrigger id="category_id">
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">Judul Buku</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="author">Penulis</Label>
                    <Input
                        id="author"
                        value={data.author}
                        onChange={(e) => setData('author', e.target.value)}
                        required
                    />
                    {errors.author && <p className="text-sm text-destructive">{errors.author}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="publisher">Penerbit</Label>
                    <Input
                        id="publisher"
                        value={data.publisher}
                        onChange={(e) => setData('publisher', e.target.value)}
                        required
                    />
                    {errors.publisher && <p className="text-sm text-destructive">{errors.publisher}</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                    id="isbn"
                    value={data.isbn}
                    onChange={(e) => setData('isbn', e.target.value)}
                    required
                />
                {errors.isbn && <p className="text-sm text-destructive">{errors.isbn}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="year">Tahun</Label>
                    <Input
                        id="year"
                        type="number"
                        value={data.year}
                        onChange={(e) => setData('year', parseInt(e.target.value))}
                        required
                    />
                    {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stok</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={data.stock}
                        onChange={(e) => setData('stock', parseInt(e.target.value))}
                        required
                        min="0"
                    />
                    {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={processing}>
                    {book ? 'Simpan Perubahan' : 'Tambah Buku'}
                </Button>
            </div>
        </form>
    );
}
