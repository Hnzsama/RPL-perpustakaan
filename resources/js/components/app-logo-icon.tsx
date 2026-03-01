import { BookOpen } from 'lucide-react';
import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<HTMLElement>) {
    return <BookOpen {...(props as any)} />;
}
