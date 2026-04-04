//* Libraries imports
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

//* Components imports
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Types imports
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

function resolveBreadcrumbLabel(
    item: BreadcrumbItemType,
    t: (key: string) => string,
): string {
    if (!item.titleKey) {
        return item.title;
    }

    const translated = t(item.titleKey);

    if (translated === item.titleKey) {
        return item.title;
    }

    return translated;
}

export function Breadcrumbs(props: { breadcrumbs: BreadcrumbItemType[] }) {
    const { t } = useTranslations();
    const breadcrumbs = props.breadcrumbs;

    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            const label = resolveBreadcrumbLabel(item, t);

                            return (
                                <Fragment key={`${String(item.href)}-${index}`}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>
                                                {label}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href}>
                                                    {label}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
