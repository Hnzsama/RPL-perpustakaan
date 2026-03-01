import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { DashboardChart } from '@/components/dashboard/dashboard-chart';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface DashboardProps {
    stats: {
        totalBooks: number;
        activeMembers: number;
        activeBorrowings: number;
        totalRevenue: number;
        borrowingGrowth: number;
    };
    chartData: Array<{ date: string; desktop: number }>;
}

export default function Dashboard({ stats, chartData }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DashboardStats stats={stats} />
                <DashboardChart chartData={chartData} />
            </div>
        </AppLayout>
    );
}
