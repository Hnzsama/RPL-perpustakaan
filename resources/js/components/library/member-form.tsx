import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Member } from '@/pages/members/columns';
import * as React from 'react';

interface MemberFormProps {
    member?: Member;
    onSuccess: () => void;
}

export function MemberForm({ member, onSuccess }: MemberFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        member_code: member?.member_code || '',
        name: member?.name || '',
        email: member?.email || '',
        phone: member?.phone || '',
        address: member?.address || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (member) {
            put(`/members/${member.id}`, {
                onSuccess: () => onSuccess(),
            });
        } else {
            post('/members', {
                onSuccess: () => onSuccess(),
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">

            <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit" disabled={processing}>
                    {member ? 'Simpan Perubahan' : 'Tambah Anggota'}
                </Button>
            </div>
        </form>
    );
}
