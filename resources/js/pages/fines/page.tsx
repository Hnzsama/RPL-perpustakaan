"use client"

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { columns, Fine } from "./columns";
import { DataTable } from "@/components/data-table";
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FineForm } from '@/components/library/fine-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Denda',
        href: '/fines',
    },
];

interface FinesPageProps {
    fines: Fine[];
    borrowings: { id: string; book: { title: string }; member: { name: string } }[];
}

export default function FinesPage({ fines, borrowings }: FinesPageProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Denda Keterlambatan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="container mx-auto py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Denda</h1>
                            <p className="text-sm text-muted-foreground">Informasi denda keterlambatan pengembalian buku.</p>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={fines}
                        filterColumn="title"
                        filterPlaceholder="Cari judul buku..."
                    />
                </div>
            </div>

        </AppLayout>
    )
}
