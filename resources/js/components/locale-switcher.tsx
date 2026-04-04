//* Libraries imports
import { router, usePage } from '@inertiajs/react';

//* Components imports
import { Button } from '@/components/ui/button';

//* Lib imports
import { cn } from '@/lib/utils';

//* Routes imports
import { update as updateLocale } from '@/routes/locale';

export function LocaleSwitcher(props: { className?: string }) {
    const page = usePage();
    const locale = page.props.locale;
    const rootClass = props.className;

    const submitLocale = (nextLocale: 'pt_BR' | 'en') => {
        if (nextLocale === locale) {
            return;
        }

        router.post(
            updateLocale.url(),
            { locale: nextLocale },
            { preserveScroll: true },
        );
    };

    return (
        <div
            className={cn(
                'inline-flex rounded-lg border border-input bg-background/80 p-1 backdrop-blur-sm',
                rootClass,
            )}
            role="group"
            aria-label="Language"
        >
            <Button
                id="locale-switcher-pt-br"
                type="button"
                variant={locale === 'pt_BR' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2.5"
                aria-pressed={locale === 'pt_BR'}
                onClick={() => submitLocale('pt_BR')}
            >
                PT
            </Button>
            <Button
                id="locale-switcher-en"
                type="button"
                variant={locale === 'en' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2.5"
                aria-pressed={locale === 'en'}
                onClick={() => submitLocale('en')}
            >
                EN
            </Button>
        </div>
    );
}
