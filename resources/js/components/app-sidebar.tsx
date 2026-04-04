//* Libraries imports
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    List,
    UsersRound,
} from 'lucide-react';

//* Components imports
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { dashboard } from '@/routes';
import { create as groupsCreate } from '@/routes/groups';
import { index as myGroupsIndex } from '@/routes/my-groups';

//* Types imports
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { t } = useTranslations();

    const mainNavItems: NavItem[] = [
        {
            title: t('app.shell.nav.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('app.shell.nav.my_drp_groups'),
            href: myGroupsIndex(),
            icon: List,
        },
        {
            title: t('app.shell.nav.create_group'),
            href: groupsCreate(),
            icon: UsersRound,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: t('app.shell.footer.repository'),
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: t('app.shell.footer.documentation'),
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
