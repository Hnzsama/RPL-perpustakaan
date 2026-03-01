"use client"

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { columns, Member } from "./columns";
import { DataTable } from "@/components/data-table";
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MemberForm } from '@/components/library/member-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anggota',
        href: '/members',
    },
];

export default function MembersPage({ members }: { members: Member[] }) {
    const [showAddDialog, setShowAddDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anggota Perpustakaan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="container mx-auto py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Anggota</h1>
                            <p className="text-sm text-muted-foreground">Kelola data anggota perpustakaan di sini.</p>
                        </div>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={members}
                        filterColumn="name"
                        filterPlaceholder="Cari nama..."
                    />
                </div>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Anggota Baru</DialogTitle>
                    </DialogHeader>
                    <MemberForm onSuccess={() => setShowAddDialog(false)} />
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}
