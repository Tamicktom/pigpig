//* Libraries imports
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

//* Components imports
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';

//* Hooks imports
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { logout } from '@/routes';
import { edit } from '@/routes/profile';

//* Types imports
import type { User } from '@/types';

type UserMenuContentProps = {
    user: User;
};

export function UserMenuContent(props: UserMenuContentProps) {
    const { t } = useTranslations();
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={props.user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        {t('app.shell.user.settings')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    type="button"
                    id="user-menu-log-out"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    {t('app.shell.user.log_out')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
