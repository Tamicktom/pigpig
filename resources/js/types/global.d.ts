import type { ReactNode } from 'react';

import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            locale: string;
            translations: Record<string, unknown>;
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            status?: string;
            success?: string;
            [key: string]: unknown;
        };
        layoutProps: {
            titleKey?: string;
            descriptionKey?: string;
            title?: string;
            description?: string;
            children?: ReactNode;
        };
    }
}
