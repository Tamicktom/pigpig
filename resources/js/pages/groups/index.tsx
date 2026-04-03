//* Libraries imports
import { Head, Link, router } from '@inertiajs/react';

//* Components imports
import { GroupsPublicShell } from '@/components/groups-public-shell';
import { Label } from '@/components/ui/label';

//* Routes imports
import { index as groupsIndex, show as groupsShow } from '@/routes/groups';

type PublicDrpOption = {
    id: number;
    name: string;
    slug: string | null;
};

type PublicGroupRow = {
    id: number;
    title: string;
    drp: PublicDrpOption | null;
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
    };
    drpOptions: PublicDrpOption[];
};

export default function GroupsIndex(groupsIndexPageProps: GroupsIndexPageProps) {
    function handleDrpFilterChange(
        event: React.ChangeEvent<HTMLSelectElement>,
    ): void {
        const raw = event.target.value;
        router.get(
            groupsIndex.url({
                query: {
                    drp_id:
                        raw === '' ? undefined : Number.parseInt(raw, 10),
                    page: 1,
                },
            }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Groups" />
            <GroupsPublicShell>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Project groups
                        </h1>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            Browse groups by DRP. Member contact details stay
                            private on these pages.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="groups-index-drp-filter">DRP</Label>
                        <select
                            id="groups-index-drp-filter"
                            className="h-9 max-w-md rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-[#161615]"
                            value={
                                groupsIndexPageProps.filters.drp_id ?? ''
                            }
                            onChange={handleDrpFilterChange}
                            aria-label="Filter groups by DRP"
                        >
                            <option value="">All DRPs</option>
                            {groupsIndexPageProps.drpOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {groupsIndexPageProps.groups.data.length === 0 ? (
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            No groups match this filter.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {groupsIndexPageProps.groups.data.map((row) => (
                                <li
                                    key={row.id}
                                    className="rounded-lg border border-[#19140035] bg-white p-4 dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex flex-col gap-1">
                                            <Link
                                                href={groupsShow.url(row.id)}
                                                className="text-base font-medium text-[#1b1b18] underline-offset-4 hover:underline dark:text-[#EDEDEC]"
                                            >
                                                {row.title}
                                            </Link>
                                            {row.drp ? (
                                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                                    {row.drp.name}
                                                </p>
                                            ) : null}
                                        </div>
                                        <Link
                                            href={groupsShow.url(row.id)}
                                            className="shrink-0 text-sm font-medium text-[#f53003] underline-offset-4 hover:underline dark:text-[#FF4433]"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {groupsIndexPageProps.groups.last_page > 1 ? (
                        <nav
                            className="flex flex-wrap items-center gap-2 pt-4"
                            aria-label="Pagination"
                        >
                            {groupsIndexPageProps.groups.links.map(
                                (link, index) => {
                                    const key = `pagination-${index}`;

                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={key}
                                                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-2 text-sm text-[#706f6c] dark:text-[#A1A09A]"
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
                                                    ? 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-[#19140035] bg-[#19140012] px-2 text-sm font-medium dark:border-[#3E3E3A] dark:bg-[#3E3E3A]/30'
                                                    : 'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-2 text-sm text-[#1b1b18] hover:bg-[#19140012] dark:text-[#EDEDEC] dark:hover:bg-[#3E3E3A]/30'
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
