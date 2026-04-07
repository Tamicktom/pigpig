//* Libraries imports
import { Head, Link, router } from '@inertiajs/react';

//* Components imports
import type { PoloDrpOption } from '@/components/drp-by-polo-select';
import { GroupsPublicPoloDrpFilterSelect } from '@/components/groups-public-polo-drp-filter-select';
import { GroupsPublicShell } from '@/components/groups-public-shell';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { index as groupsIndex, show as groupsShow } from '@/routes/groups';

type PublicGroupDrp = {
    id: number;
    name: string;
    slug: string | null;
};

type PublicGroupRow = {
    id: number;
    title: string;
    drp: PublicGroupDrp | null;
};

type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedPublicGroups = {
    data: PublicGroupRow[];
    links: PaginatorLink[];
    current_page: number;
    last_page: number;
    total: number;
};

type GroupsIndexPageProps = {
    groups: PaginatedPublicGroups;
    filters: {
        drp_id: number | null;
        polo_id: number | null;
    };
    poloOptions: PoloDrpOption[];
};

export default function GroupsIndex(props: GroupsIndexPageProps) {
    const { t } = useTranslations();

    function handleSelectPoloFilter(
        selection: { drp_id: number; polo_id: number } | null,
    ): void {
        router.get(
            groupsIndex.url({
                query: {
                    drp_id:
                        selection === null ? undefined : selection.drp_id,
                    polo_id:
                        selection === null ? undefined : selection.polo_id,
                    page: 1,
                },
            }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    return (
        <>
            <Head title={t('groups.public.head_title')} />
            <GroupsPublicShell>
                <div className="flex flex-col gap-10 md:gap-12">
                    <div className="flex max-w-3xl flex-col gap-4">
                        <h1 className="font-headline text-4xl font-black tracking-tight text-on-background md:text-5xl">
                            {t('groups.public.heading')}
                        </h1>
                        <p className="text-lg leading-relaxed text-on-surface-variant">
                            {t('groups.public.description')}
                        </p>
                    </div>

                    <div className="flex max-w-md flex-col gap-2">
                        <Label
                            className="text-on-surface"
                            htmlFor="groups-index-polo-filter"
                        >
                            {t('groups.public.filter_label')}
                        </Label>
                        <GroupsPublicPoloDrpFilterSelect
                            inputId="groups-index-polo-filter"
                            toggleButtonId="groups-index-polo-filter-toggle"
                            poloOptions={props.poloOptions}
                            selectedDrpId={props.filters.drp_id}
                            selectedPoloId={props.filters.polo_id}
                            onSelectPoloFilter={handleSelectPoloFilter}
                        />
                    </div>

                    {props.groups.data.length === 0 ? (
                        <p className="text-base text-on-surface-variant">
                            {t('groups.public.empty')}
                        </p>
                    ) : (
                        <section
                            className="rounded-2xl bg-surface-container-low p-8 md:p-10"
                            aria-label={t('groups.public.list_aria')}
                        >
                            <ul className="flex flex-col gap-8 md:gap-12">
                                {props.groups.data.map((row) => (
                                    <li
                                        key={row.id}
                                        className="rounded-xl bg-surface-container-lowest p-6 md:p-8"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                                            <div className="flex min-w-0 flex-col gap-2">
                                                <Link
                                                    href={groupsShow.url(
                                                        row.id,
                                                    )}
                                                    className="text-lg font-semibold text-on-surface transition-colors duration-200 ease-out hover:text-primary"
                                                >
                                                    {row.title}
                                                </Link>
                                                {row.drp ? (
                                                    <p className="text-sm text-on-surface-variant">
                                                        {row.drp.name}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <Button
                                                id={`groups-index-view-${row.id}`}
                                                type="button"
                                                size="sm"
                                                className="landing-primary-cta shrink-0 rounded-xl font-bold tracking-tight text-primary-foreground shadow-none"
                                                asChild
                                            >
                                                <Link
                                                    href={groupsShow.url(
                                                        row.id,
                                                    )}
                                                >
                                                    {t('groups.my.view')}
                                                </Link>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {props.groups.last_page > 1 ? (
                        <nav
                            className="flex flex-wrap items-center gap-2 pt-2"
                            aria-label={t('groups.my.pagination_aria')}
                        >
                            {props.groups.links.map(
                                (link, index) => {
                                    const key = `pagination-${index}`;

                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={key}
                                                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm text-on-surface-variant"
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
                                                    ? 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg bg-surface-container-high px-2 text-sm font-medium text-on-surface transition-colors duration-200 ease-out'
                                                    : 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm text-on-surface transition-colors duration-200 ease-out hover:bg-surface-container-low'
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
            </GroupsPublicShell>
        </>
    );
}
