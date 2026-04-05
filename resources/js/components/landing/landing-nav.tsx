//* Libraries imports
import { Link } from '@inertiajs/react';

//* Components imports
import { AppearanceMenuButton } from '@/components/appearance-menu-button';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { dashboard, home, login, register } from '@/routes';
import { index as groupsIndex } from '@/routes/groups';

type LandingNavProps = {
    appName: string;
    canRegister: boolean;
    isAuthenticated: boolean;
};

export function LandingNav(landingNavProps: LandingNavProps) {
    const appName = landingNavProps.appName;
    const canRegister = landingNavProps.canRegister;
    const isAuthenticated = landingNavProps.isAuthenticated;
    const { t } = useTranslations();

    const linkClassName =
        'text-sm font-medium text-landing-brand transition-colors duration-200 ease-out hover:text-primary dark:text-landing-brand dark:hover:text-primary';

    const brandClassName =
        'font-headline text-2xl font-black text-landing-brand dark:text-landing-brand';

    return (
        <nav className="fixed top-0 z-50 w-full bg-landing-nav-glass backdrop-blur-[20px]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                <Link
                    id="landing-nav-brand"
                    href={home.url()}
                    className={brandClassName}
                >
                    {appName}
                </Link>
                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        id="landing-nav-section-sobre"
                        href={`${home.url()}#sobre`}
                        className={linkClassName}
                    >
                        {t('landing.nav.about')}
                    </Link>
                    <Link
                        id="landing-nav-section-como-funciona"
                        href={`${home.url()}#como-funciona`}
                        className={linkClassName}
                    >
                        {t('landing.nav.how_it_works')}
                    </Link>
                    <Link
                        id="landing-nav-section-equipe"
                        href={`${home.url()}#equipe`}
                        className={linkClassName}
                    >
                        {t('landing.nav.team')}
                    </Link>
                    <Link
                        id="landing-nav-section-contato"
                        href={`${home.url()}#contato`}
                        className={linkClassName}
                    >
                        {t('landing.nav.contact')}
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <AppearanceMenuButton
                        triggerId="landing-nav-theme-menu-trigger"
                        triggerClassName="border border-landing-brand/20 bg-landing-nav-glass/80 dark:border-landing-brand-foreground/20"
                    />
                    <LocaleSwitcher className="border-landing-brand/20 bg-landing-nav-glass/80 dark:border-landing-brand-foreground/20" />
                    {isAuthenticated ? (
                        <>
                            <Button
                                id="landing-nav-dashboard"
                                type="button"
                                variant="ghost"
                                className="hidden sm:inline-flex"
                                asChild
                            >
                                <Link href={dashboard.url()}>
                                    {t('app.shell.nav.dashboard')}
                                </Link>
                            </Button>
                            <Button
                                id="landing-nav-groups-auth"
                                type="button"
                                className="landing-primary-cta rounded-xl font-bold tracking-tight text-primary-foreground shadow-none"
                                asChild
                            >
                                <Link href={groupsIndex.url()}>
                                    {t('app.groups_public.nav.groups')}
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                id="landing-nav-login"
                                type="button"
                                variant="ghost"
                                className="hidden sm:inline-flex"
                                asChild
                            >
                                <Link href={login.url()}>
                                    {t('auth.login.submit')}
                                </Link>
                            </Button>
                            {canRegister ? (
                                <Button
                                    id="landing-nav-register"
                                    type="button"
                                    variant="ghost"
                                    className="hidden sm:inline-flex"
                                    asChild
                                >
                                    <Link href={register.url()}>
                                        {t('auth.login.sign_up')}
                                    </Link>
                                </Button>
                            ) : null}
                            <Button
                                id="landing-nav-cta-primary"
                                type="button"
                                className="landing-primary-cta rounded-xl px-6 py-2.5 font-bold tracking-tight text-primary-foreground shadow-none"
                                asChild
                            >
                                <Link href={groupsIndex.url()}>
                                    {t('landing.nav.start_now')}
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
