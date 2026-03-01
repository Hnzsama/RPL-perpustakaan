import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Perpustakaan',
        href: '/settings/library',
    },
];

interface Setting {
    id: number;
    key: string;
    value: string;
    type: string;
    label: string;
}

interface SettingsPageProps {
    settings: Setting[];
}

export default function SettingsPage({ settings }: SettingsPageProps) {
    const { data, setData, put, processing, recentlySuccessful } = useForm({
        settings: settings.map(s => ({ key: s.key, value: s.value })),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/library/1', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Perpustakaan" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Pengaturan Perpustakaan"
                        description="Atur tarif denda untuk buku yang terlambat dikembalikan"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {settings.map((setting, index) => (
                            <div key={setting.key} className="grid gap-2">
                                <Label htmlFor={setting.key}>{setting.label}</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">Rp</span>
                                    <Input
                                        id={setting.key}
                                        type="number"
                                        className="pl-9 mt-1 block w-full"
                                        value={data.settings[index].value}
                                        onChange={(e) => {
                                            const newSettings = [...data.settings];
                                            newSettings[index].value = e.target.value;
                                            setData('settings', newSettings);
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Simpan Perubahan</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Berhasil disimpan</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
