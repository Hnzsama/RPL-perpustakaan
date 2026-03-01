"use client"

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { getColumns, Book } from "./columns";
import { DataTable } from "@/components/data-table";
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookForm } from '@/components/library/book-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Buku',
        href: '/books',
    },
];

interface BooksPageProps {
    books: Book[];
    categories: { id: string; name: string }[];
}

export default function BooksPage({ books, categories }: BooksPageProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);

    const columns = useMemo(() => getColumns(categories), [categories]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Koleksi Buku" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="container mx-auto py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Buku</h1>
                            <p className="text-sm text-muted-foreground">Daftar koleksi buku yang tersedia di perpustakaan digital.</p>
                        </div>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Buku
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={books}
                        filterColumn="title"
                        filterPlaceholder="Cari judul buku..."
                    />
                </div>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Buku Baru</DialogTitle>
                    </DialogHeader>
                    <BookForm categories={categories} onSuccess={() => setShowAddDialog(false)} />
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}
