//* Libraries imports
import { Head, Link } from '@inertiajs/react';

//* Components imports
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { dashboard } from '@/routes';
import { create as groupsCreate, show as groupsShow } from '@/routes/groups';
import { index as myGroupsIndex } from '@/routes/my-groups';

type MyDrpOption = {
    id: number;
    name: string;
    slug: string | null;
};

type MyGroupRow = {
    id: number;
    title: string;
    is_member: boolean;
    drp: MyDrpOption | null;
};

type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedMyGroups = {
    data: MyGroupRow[];
    links: PaginatorLink[];
    current_page: number;
    last_page: number;
    total: number;
};

type MyGroupsIndexPageProps = {
    groups: PaginatedMyGroups;
    drp: {
        name: string;
    };
};

export default function MyGroupsIndex(
    myGroupsIndexPageProps: MyGroupsIndexPageProps,
) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('groups.my.head_title')} />
            <div className="flex max-w-3xl flex-col gap-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('groups.my.heading')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('groups.my.description_before_drp')}{' '}
                            <span className="font-medium text-foreground">
                                {myGroupsIndexPageProps.drp.name}
                            </span>
                            {t('groups.my.description_after_drp')}
                        </p>
                    </div>
                    <Button
                        id="my-groups-create"
                        type="button"
                        className="shrink-0"
                        asChild
                    >
                        <Link href={groupsCreate.url()} prefetch>
                            {t('app.shell.nav.create_group')}
                        </Link>
                    </Button>
                </div>

                {myGroupsIndexPageProps.groups.data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        {t('groups.my.empty')}
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {myGroupsIndexPageProps.groups.data.map((row) => (
                            <li
                                key={row.id}
                                className="rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Link
                                                href={groupsShow.url(row.id)}
                                                className="text-base font-medium text-foreground underline-offset-4 hover:underline"
                                            >
                                                {row.title}
                                            </Link>
                                            {row.is_member ? (
                                                <Badge variant="secondary">
                                                    {t('groups.my.member_badge')}
                                                </Badge>
                                            ) : null}
                                        </div>
                                        {row.drp ? (
                                            <p className="text-sm text-muted-foreground">
                                                {row.drp.name}
                                            </p>
                                        ) : null}
                                    </div>
                                    <Link
                                        href={groupsShow.url(row.id)}
                                        className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        {t('groups.my.view')}
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {myGroupsIndexPageProps.groups.last_page > 1 ? (
                    <nav
                        className="flex flex-wrap items-center gap-2 pt-4"
                        aria-label={t('groups.my.pagination_aria')}
                    >
                        {myGroupsIndexPageProps.groups.links.map(
                            (link, index) => {
                                const key = `my-groups-pagination-${index}`;

                                if (link.url === null) {
                                    return (
                                        <span
                                            key={key}
                                            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-2 text-sm text-muted-foreground"
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        preserveState
                                        preserveScroll
                                        className={
                                            link.active
                                                ? 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-sidebar-border/70 bg-muted/50 px-2 text-sm font-medium dark:border-sidebar-border'
                                                : 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-2 text-sm text-foreground hover:bg-muted/50'
                                        }
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                );
                            },
                        )}
                    </nav>
                ) : null}
            </div>
        </>
    );
}

MyGroupsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            titleKey: 'app.shell.breadcrumb.dashboard',
            href: dashboard.url(),
        },
        {
            title: 'My DRP groups',
            titleKey: 'app.shell.breadcrumb.my_drp_groups',
            href: myGroupsIndex.url(),
        },
    ],
};
