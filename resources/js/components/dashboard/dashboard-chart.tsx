"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Grafik Peminjaman"

const chartConfig = {
    desktop: {
        label: "Peminjaman",
        color: "var(--primary)",
    },
} satisfies ChartConfig

interface DashboardChartProps {
    chartData: Array<{ date: string; desktop: number }>
}

export function DashboardChart({ chartData }: DashboardChartProps) {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("90d")

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        // Use the latest date in the dataset as the reference date, or today if empty
        const referenceDate = chartData.length > 0 ? new Date(chartData[chartData.length - 1].date) : new Date()

        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
                <div className="flex flex-col gap-1.5">
                    <CardTitle>Aktivitas Peminjaman</CardTitle>
                    <CardDescription>
                        <span className="hidden sm:block">
                            Tren peminjaman buku perpustakaan
                        </span>
                        <span className="sm:hidden">Tren Peminjaman</span>
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={(val) => val && setTimeRange(val)}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 sm:flex"
                    >
                        <ToggleGroupItem value="90d">3 Bulan</ToggleGroupItem>
                        <ToggleGroupItem value="30d">30 Hari</ToggleGroupItem>
                        <ToggleGroupItem value="7d">7 Hari</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-[140px] **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate sm:hidden"
                            size="sm"
                            aria-label="Pilih rentang waktu"
                        >
                            <SelectValue placeholder="3 Bulan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                3 Bulan Terakhir
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                30 Hari Terakhir
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                7 Hari Terakhir
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("id-ID", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("id-ID", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
