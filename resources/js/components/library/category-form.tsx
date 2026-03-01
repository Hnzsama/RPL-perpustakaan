import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/pages/categories/columns';
import * as React from 'react';

interface CategoryFormProps {
    category?: Category;
    onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category) {
            put(`/categories/${category.id}`, {
                onSuccess: () => onSuccess(),
            });
        } else {
            post('/categories', {
                onSuccess: () => onSuccess(),
            });
        }
    };

    // Auto-slugify name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData({
            ...data,
            name: name,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={handleNameChange}
                    required
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    required
                />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={processing}>
                    {category ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </Button>
            </div>
        </form>
    );
}
