"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Edit, Trash, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BorrowingForm } from "@/components/library/borrowing-form"
import { FineForm } from "@/components/library/fine-form"
import { router } from "@inertiajs/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Borrowing = {
    id: string
    book_title: string
    member_name: string
    borrow_date: string
    due_date: string
    status: "borrowed" | "returned" | "overdue"
    suggested_fine?: number
    book?: {
        id: string
        title: string
    }
    member?: {
        id: string
        name: string
    }
}

export const columns: ColumnDef<Borrowing>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "book.title",
        id: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Judul Buku
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "member.name",
        header: "Nama Anggota",
    },
    {
        accessorKey: "borrow_date",
        header: "Tgl Pinjam",
        cell: ({ row }) => {
            const dateStr: string = row.getValue("borrow_date");
            return new Date(dateStr).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        },
    },
    {
        accessorKey: "due_date",
        header: "Batas Kembali",
        cell: ({ row }) => {
            const dateStr: string = row.getValue("due_date");
            return new Date(dateStr).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "returned" ? "success" :
                            status === "overdue" ? "destructive" :
                                "secondary"
                    }
                >
                    {status === 'borrowed' ? 'Dipinjam' : status === 'returned' ? 'Dikembalikan' : 'Terlambat'}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const borrowing = row.original
            const [showEditDialog, setShowEditDialog] = useState(false)

            const onDelete = () => {
                if (confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
                    router.delete(`/borrowings/${borrowing.id}`)
                }
            }

            return (
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                <Edit className="mr-2 h-4 w-4" /> Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                                <Trash className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Status Peminjaman</DialogTitle>
                            </DialogHeader>
                            <BorrowingForm
                                borrowing={borrowing}
                                onSuccess={() => setShowEditDialog(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            )
        },
    },
]
