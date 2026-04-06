//* Libraries imports
import { Head, Link } from '@inertiajs/react';
import { Globe2, List, UsersRound } from 'lucide-react';

//* Components imports
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { create as groupsCreate, index as groupsIndex } from '@/routes/groups';
import { index as myGroupsIndex } from '@/routes/my-groups';

export default function Dashboard() {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('app.dashboard.head_title')} />
            <div className="flex max-w-3xl flex-col gap-8 p-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('app.dashboard.heading')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t('app.dashboard.description')}
                    </p>
                </div>
                <nav
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    aria-label={t('app.dashboard.nav_aria')}
                >
                    <Card className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <List
                                    className="size-5 shrink-0 text-muted-foreground"
                                    aria-hidden
                                />
                                <CardTitle className="text-base">
                                    {t('app.shell.nav.my_drp_groups')}
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {t('app.dashboard.card_my_groups')}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                            <Button
                                id="dashboard-cta-my-groups"
                                type="button"
                                className="w-full"
                                asChild
                            >
                                <Link
                                    href={myGroupsIndex.url()}
                                    prefetch
                                >
                                    {t('app.shell.nav.my_drp_groups')}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <UsersRound
                                    className="size-5 shrink-0 text-muted-foreground"
                                    aria-hidden
                                />
                                <CardTitle className="text-base">
                                    {t('app.shell.nav.create_group')}
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {t('app.dashboard.card_create')}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                            <Button
                                id="dashboard-cta-create-group"
                                type="button"
                                className="w-full"
                                asChild
                            >
                                <Link
                                    href={groupsCreate.url()}
                                    prefetch
                                >
                                    {t('app.shell.nav.create_group')}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="flex flex-col sm:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe2
                                    className="size-5 shrink-0 text-muted-foreground"
                                    aria-hidden
                                />
                                <CardTitle className="text-base">
                                    {t('groups.public.heading')}
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {t('app.dashboard.card_browse')}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                            <Button
                                id="dashboard-cta-browse-groups"
                                type="button"
                                variant="secondary"
                                className="w-full"
                                asChild
                            >
                                <Link href={groupsIndex.url()} prefetch>
                                    {t('groups.public.heading')}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </nav>
            </div>
        </>
    );
}
