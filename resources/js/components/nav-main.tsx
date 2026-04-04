//* Libraries imports
import { Link } from '@inertiajs/react';

//* Components imports
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

//* Hooks imports
import { useCurrentUrl } from '@/hooks/use-current-url';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Types imports
import type { NavItem } from '@/types';

export function NavMain(props: { items: NavItem[] }) {
    const items = props.items;
    const { t } = useTranslations();
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>
                {t('app.shell.section.platform')}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={String(item.href)}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
