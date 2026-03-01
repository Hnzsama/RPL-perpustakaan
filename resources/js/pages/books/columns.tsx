"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookForm } from "@/components/library/book-form"
import { router } from "@inertiajs/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Book = {
    id: string
    title: string
    author: string
    publisher: string
    isbn: string
    year: number
    stock: number
    category?: {
        id: string
        name: string
    }
}

// We'll use a wrapper to pass categories
export const getColumns = (categories: { id: string; name: string }[]): ColumnDef<Book>[] => [
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
        accessorKey: "title",
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
        accessorKey: "author",
        header: "Penulis",
    },
    {
        accessorKey: "publisher",
        header: "Penerbit",
    },
    {
        accessorKey: "isbn",
        header: "ISBN",
    },
    {
        accessorKey: "year",
        header: "Tahun",
    },
    {
        accessorKey: "stock",
        header: "Stok",
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const book = row.original
            const [showEditDialog, setShowEditDialog] = useState(false)

            const onDelete = () => {
                if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
                    router.delete(`/books/${book.id}`)
                }
            }

            return (
                <>
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
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                                <Trash className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Edit Buku</DialogTitle>
                            </DialogHeader>
                            <BookForm
                                book={{ ...book, category_id: book.category?.id }}
                                categories={categories}
                                onSuccess={() => setShowEditDialog(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    },
]
