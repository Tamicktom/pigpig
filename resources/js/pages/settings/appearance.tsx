//* Libraries imports
import { Head } from '@inertiajs/react';

//* Components imports
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('settings.appearance.head_title')} />

            <h1 className="sr-only">{t('settings.appearance.head_title')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.appearance.heading_title')}
                    description={t('settings.appearance.heading_description')}
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            titleKey: 'app.shell.breadcrumb.appearance_settings',
            href: editAppearance(),
        },
    ],
};
