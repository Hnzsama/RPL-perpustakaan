import { Book, Users, Clock, CreditCard, TrendingUp, TrendingDown, Library } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface DashboardStatsProps {
    stats: {
        totalBooks: number;
        activeMembers: number;
        activeBorrowings: number;
        totalRevenue: number;
        borrowingGrowth: number;
    }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const isGrowthPositive = stats.borrowingGrowth >= 0;

    const formattedRevenue = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(stats.totalRevenue);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                <CardHeader className="pb-2">
                    <CardDescription>Buku Tersedia</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                        {stats.totalBooks}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="gap-1 font-normal">
                            <Book className="size-3" />
                            Stok
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm mt-4">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Koleksi buku perpustakaan <Library className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Buku siap untuk dipinjam
                    </div>
                </CardFooter>
            </Card>

            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                <CardHeader className="pb-2">
                    <CardDescription>Anggota Aktif</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                        {stats.activeMembers}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="gap-1 font-normal">
                            <Users className="size-3" />
                            Aktif
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm mt-4">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Pendaftar perpustakaan <Users className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Anggota terdaftar di sistem
                    </div>
                </CardFooter>
            </Card>

            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                <CardHeader className="pb-2">
                    <CardDescription>Sedang Dipinjam</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                        {stats.activeBorrowings}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="gap-1 font-normal">
                            {isGrowthPositive ? (
                                <><TrendingUp className="size-3 text-emerald-500" /> +{stats.borrowingGrowth}%</>
                            ) : (
                                <><TrendingDown className="size-3 text-red-500" /> {stats.borrowingGrowth}%</>
                            )}
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm mt-4">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {isGrowthPositive ? 'Tren naik bulan ini' : 'Tren turun bulan ini'}
                        {isGrowthPositive ? <TrendingUp className="size-4 text-emerald-500" /> : <TrendingDown className="size-4 text-red-500" />}
                    </div>
                    <div className="text-muted-foreground">
                        Sirkulasi peminjaman buku
                    </div>
                </CardFooter>
            </Card>

            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
                <CardHeader className="pb-2">
                    <CardDescription>Pendapatan Denda</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                        {formattedRevenue}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="gap-1 font-normal">
                            <CreditCard className="size-3" />
                            Lunas
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm mt-4">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Pemasukan keterlambatan <CreditCard className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Denda yang telah diselesaikan
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
