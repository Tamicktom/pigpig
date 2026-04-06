//* Libraries imports
import type { Page } from '@inertiajs/core';
import type { ReactNode } from 'react';

//* Types imports
import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    interface Router {
        page: Page;
    }
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
