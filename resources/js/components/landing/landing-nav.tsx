//* Libraries imports
import { Link } from '@inertiajs/react';

//* Components imports
import { Button } from '@/components/ui/button';

//* Routes imports
import { dashboard, login, register } from '@/routes';
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

    const linkClassName =
        'text-sm font-medium text-landing-brand transition-colors duration-200 ease-out hover:text-primary dark:text-landing-brand-foreground dark:hover:text-primary';

    return (
        <nav className="fixed top-0 z-50 w-full bg-landing-nav-glass backdrop-blur-[20px]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                <div className="font-headline text-2xl font-black text-landing-brand dark:text-landing-brand-foreground">
                    {appName}
                </div>
                <div className="hidden items-center gap-8 md:flex">
                    <a href="#sobre" className={linkClassName}>
                        Sobre
                    </a>
                    <a href="#como-funciona" className={linkClassName}>
                        Como Funciona
                    </a>
                    <a href="#equipe" className={linkClassName}>
                        Equipe
                    </a>
                    <a href="#contato" className={linkClassName}>
                        Contato
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <Button
                                id="landing-nav-dashboard"
                                type="button"
                                variant="ghost"
                                className="hidden sm:inline-flex"
                                asChild
                            >
                                <Link href={dashboard.url()}>Dashboard</Link>
                            </Button>
                            <Button
                                id="landing-nav-groups-auth"
                                type="button"
                                className="landing-primary-cta rounded-xl font-bold tracking-tight text-primary-foreground shadow-none"
                                asChild
                            >
                                <Link href={groupsIndex.url()}>Grupos</Link>
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
                                <Link href={login.url()}>Entrar</Link>
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
                                        Cadastrar
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
                                    Começar Agora
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
