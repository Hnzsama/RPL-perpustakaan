"use client"

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { columns, Borrowing } from "./columns";
import { DataTable } from "@/components/data-table";
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BorrowingForm } from '@/components/library/borrowing-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Peminjaman',
        href: '/borrowings',
    },
];

interface BorrowingsPageProps {
    borrowings: Borrowing[];
    books: { id: string; title: string }[];
    members: { id: string; name: string }[];
}

export default function BorrowingsPage({ borrowings, books, members }: BorrowingsPageProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Peminjaman" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="container mx-auto py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Peminjaman</h1>
                            <p className="text-sm text-muted-foreground">Pantau status peminjaman dan pengembalian buku.</p>
                        </div>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Peminjaman
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={borrowings}
                        filterColumn="title"
                        filterPlaceholder="Cari judul buku..."
                    />
                </div>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Catat Peminjaman Baru</DialogTitle>
                    </DialogHeader>
                    <BorrowingForm books={books} members={members} onSuccess={() => setShowAddDialog(false)} />
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}
