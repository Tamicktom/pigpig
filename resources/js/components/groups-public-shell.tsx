//* Libraries imports
import { Link, usePage } from '@inertiajs/react';

//* Components imports
import { EmailVerificationBanner } from '@/components/email-verification-banner';
import { Button } from '@/components/ui/button';

//* Routes imports
import { dashboard, home, login, register } from '@/routes';
import { index as groupsIndex } from '@/routes/groups';

type GroupsPublicShellSharedProps = {
    name: string;
    canRegister?: boolean;
    auth: {
        user: unknown;
    };
};

type GroupsPublicShellProps = {
    children: React.ReactNode;
};

const navLinkClassName =
    'text-sm font-medium text-landing-brand transition-colors duration-200 ease-out hover:text-primary dark:text-landing-brand-foreground dark:hover:text-primary';

export function GroupsPublicShell(
    props: GroupsPublicShellProps,
) {
    const page = usePage<GroupsPublicShellSharedProps>();
    const auth = page.props.auth;
    const appName = page.props.name;
    const canRegister = page.props.canRegister ?? false;

    return (
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
            <div className="w-full self-stretch">
                <EmailVerificationBanner variant="public" />
            </div>
            <header className="fixed top-0 z-50 w-full bg-landing-nav-glass backdrop-blur-[20px]">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-8 py-4">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-6">
                        <Link
                            id="groups-shell-brand"
                            href={home.url()}
                            className="font-headline shrink-0 text-2xl font-black text-landing-brand dark:text-landing-brand-foreground"
                        >
                            {appName}
                        </Link>
                        <nav
                            className="flex flex-wrap items-center gap-2 md:gap-4"
                            aria-label="Principal"
                        >
                            <Button
                                id="groups-shell-nav-home"
                                type="button"
                                variant="ghost"
                                className={navLinkClassName}
                                asChild
                            >
                                <Link href={home.url()}>Início</Link>
                            </Button>
                            <Button
                                id="groups-shell-nav-groups"
                                type="button"
                                variant="ghost"
                                className={navLinkClassName}
                                asChild
                            >
                                <Link href={groupsIndex.url()}>Grupos</Link>
                            </Button>
                        </nav>
                    </div>
                    <nav
                        className="flex flex-wrap items-center gap-2 md:gap-3"
                        aria-label="Conta"
                    >
                        {auth.user ? (
                            <Button
                                id="groups-shell-dashboard"
                                type="button"
                                variant="ghost"
                                className={navLinkClassName}
                                asChild
                            >
                                <Link href={dashboard.url()}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    id="groups-shell-login"
                                    type="button"
                                    variant="ghost"
                                    className={navLinkClassName}
                                    asChild
                                >
                                    <Link href={login.url()}>Entrar</Link>
                                </Button>
                                {canRegister ? (
                                    <Button
                                        id="groups-shell-register"
                                        type="button"
                                        className="landing-primary-cta rounded-xl font-bold tracking-tight text-primary-foreground shadow-none"
                                        asChild
                                    >
                                        <Link href={register.url()}>
                                            Cadastrar
                                        </Link>
                                    </Button>
                                ) : null}
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-8 pb-12 pt-20">
                {props.children}
            </main>
        </div>
    );
}
