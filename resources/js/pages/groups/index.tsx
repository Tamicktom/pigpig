//* Libraries imports
import { Head, Link, router } from '@inertiajs/react';

//* Components imports
import { GroupsPublicShell } from '@/components/groups-public-shell';
import { Button } from '@/components/ui/button';
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

export default function GroupsIndex(props: GroupsIndexPageProps) {
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
            <Head title="Grupos" />
            <GroupsPublicShell>
                <div className="flex flex-col gap-10 md:gap-12">
                    <div className="flex max-w-3xl flex-col gap-4">
                        <h1 className="font-headline text-4xl font-black tracking-tight text-on-background md:text-5xl">
                            Grupos do projeto
                        </h1>
                        <p className="text-lg leading-relaxed text-on-surface-variant">
                            Navegue pelos grupos por DRP. Os dados de contato dos
                            membros permanecem privados nestas páginas.
                        </p>
                    </div>

                    <div className="flex max-w-md flex-col gap-2">
                        <Label
                            className="text-on-surface"
                            htmlFor="groups-index-drp-filter"
                        >
                            DRP
                        </Label>
                        <select
                            id="groups-index-drp-filter"
                            className="h-10 w-full rounded-lg bg-surface-container-highest px-3 text-sm text-on-surface outline-none transition-[box-shadow] duration-200 ease-out focus-visible:ring-[3px] focus-visible:ring-secondary/80 focus-visible:ring-offset-0"
                            value={
                                props.filters.drp_id ?? ''
                            }
                            onChange={handleDrpFilterChange}
                            aria-label="Filtrar grupos por DRP"
                        >
                            <option value="">Todas as DRPs</option>
                            {props.drpOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {props.groups.data.length === 0 ? (
                        <p className="text-base text-on-surface-variant">
                            Nenhum grupo corresponde a este filtro.
                        </p>
                    ) : (
                        <section
                            className="rounded-2xl bg-surface-container-low p-8 md:p-10"
                            aria-label="Lista de grupos"
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
                                                    Ver
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
                            aria-label="Paginação"
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
