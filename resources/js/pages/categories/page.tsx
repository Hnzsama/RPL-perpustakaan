"use client"

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { columns, Category } from "./columns";
import { DataTable } from "@/components/data-table";
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryForm } from '@/components/library/category-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori',
        href: '/categories',
    },
];

export default function CategoriesPage({ categories }: { categories: Category[] }) {
    const [showAddDialog, setShowAddDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Buku" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="container mx-auto py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Kategori</h1>
                            <p className="text-sm text-muted-foreground">Daftar kategori untuk mengelompokkan koleksi buku.</p>
                        </div>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={categories}
                        filterColumn="name"
                        filterPlaceholder="Cari kategori..."
                    />
                </div>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kategori Baru</DialogTitle>
                    </DialogHeader>
                    <CategoryForm onSuccess={() => setShowAddDialog(false)} />
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}
