//* Libraries imports
import { Link, usePage } from '@inertiajs/react';

//* Components imports
import { EmailVerificationBanner } from '@/components/email-verification-banner';

//* Routes imports
import { dashboard, home, login, register } from '@/routes';
import { index as groupsIndex } from '@/routes/groups';

type GroupsPublicShellProps = {
    children: React.ReactNode;
};

export function GroupsPublicShell(
    groupsPublicShellProps: GroupsPublicShellProps,
) {
    const page = usePage();
    const auth = page.props.auth;
    const canRegister =
        (page.props as { canRegister?: boolean }).canRegister ?? false;

    return (
        <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            <EmailVerificationBanner variant="public" />
            <header className="border-b border-[#19140035] dark:border-[#3E3E3A]">
                <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                    <nav
                        className="flex flex-wrap items-center gap-4 text-sm"
                        aria-label="Primary"
                    >
                        <Link
                            href={home.url()}
                            className="rounded-sm px-2 py-1.5 text-[#1b1b18] hover:bg-[#19140012] dark:text-[#EDEDEC] dark:hover:bg-[#3E3E3A]/40"
                        >
                            Home
                        </Link>
                        <Link
                            href={groupsIndex.url()}
                            className="rounded-sm px-2 py-1.5 text-[#1b1b18] hover:bg-[#19140012] dark:text-[#EDEDEC] dark:hover:bg-[#3E3E3A]/40"
                        >
                            Groups
                        </Link>
                    </nav>
                    <nav
                        className="flex flex-wrap items-center gap-4 text-sm"
                        aria-label="Account"
                    >
                        {auth.user ? (
                            <Link
                                href={dashboard.url()}
                                className="rounded-sm px-2 py-1.5 text-[#1b1b18] hover:bg-[#19140012] dark:text-[#EDEDEC] dark:hover:bg-[#3E3E3A]/40"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login.url()}
                                    className="rounded-sm px-2 py-1.5 text-[#1b1b18] hover:bg-[#19140012] dark:text-[#EDEDEC] dark:hover:bg-[#3E3E3A]/40"
                                >
                                    Log in
                                </Link>
                                {canRegister ? (
                                    <Link
                                        href={register.url()}
                                        className="rounded-sm border border-[#19140035] px-3 py-1.5 text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                ) : null}
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-4xl px-6 py-8">
                {groupsPublicShellProps.children}
            </main>
        </div>
    );
}
