import { createInertiaApp, router } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { translate } from '@/lib/i18n';

const viteAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

function resolveDocumentTitle(innerTitle: string): string {
    const pageProps = router.page?.props as
        | {
              translations?: Record<string, unknown>;
              name?: string;
          }
        | undefined;

    const translations =
        (pageProps?.translations as Record<string, unknown> | undefined) ?? {};
    const appName =
        typeof pageProps?.name === 'string' && pageProps.name.length > 0
            ? pageProps.name
            : viteAppName;

    if (!innerTitle.trim()) {
        return appName;
    }

    const formatted = translate(
        translations,
        'app.meta.document_title',
        { title: innerTitle, app: appName },
    );

    if (formatted === 'app.meta.document_title') {
        return `${innerTitle} - ${appName}`;
    }

    return formatted;
}

createInertiaApp({
    title: (title) => resolveDocumentTitle(title ?? ''),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name === 'groups/index' || name === 'groups/show':
                return null;
            case name === "groups/create" || name === "my/groups":
                return AppHeaderLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name === 'dashboard':
                return AppHeaderLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
