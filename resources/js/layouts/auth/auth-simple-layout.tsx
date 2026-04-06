//* Libraries imports
import { usePage } from '@inertiajs/react';

//* Components imports
import { LandingNav } from '@/components/landing/landing-nav';

//* Types imports
import type { AuthLayoutProps } from '@/types';

type AuthPageSharedProps = {
    name: string;
    canRegister?: boolean;
    auth: {
        user: unknown;
    };
};

export default function AuthSimpleLayout(props: AuthLayoutProps) {
    const children = props.children;
    const title = props.title;
    const description = props.description;

    const page = usePage<AuthPageSharedProps>();
    const appName = page.props.name;
    const canRegister = page.props.canRegister ?? false;
    const isAuthenticated = page.props.auth.user !== null;

    return (
        <div className="min-h-svh bg-background text-foreground">
            <LandingNav
                appName={appName}
                canRegister={canRegister}
                isAuthenticated={isAuthenticated}
            />
            <main className="flex min-h-svh flex-col pt-20">
                <div className="flex flex-1 items-center justify-center px-6 py-10 md:px-10">
                    <div className="w-full max-w-lg rounded-2xl bg-surface-container-low p-2 md:p-3">
                        <div className="rounded-xl bg-surface-container-lowest premium-shadow px-8 py-10 md:px-10 md:py-12">
                            <div className="flex flex-col gap-3 pb-8 text-center">
                                <h1 className="font-headline text-3xl font-semibold tracking-tight text-on-background md:text-4xl">
                                    {title}
                                </h1>
                                {description ? (
                                    <p className="text-pretty text-sm leading-relaxed text-on-surface-variant md:text-base">
                                        {description}
                                    </p>
                                ) : null}
                            </div>
                            <div className="auth-editorial-fields [&_select:focus-visible]:ring-0 [&_[data-slot=input]:focus-visible]:ring-0 [&_[data-slot=input]:focus-visible]:ring-offset-0">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
