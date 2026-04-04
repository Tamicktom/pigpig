//* Libraries imports
import { Form, Head, router } from '@inertiajs/react';

//* Components imports
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { dashboard } from '@/routes';
import { create as groupsCreate, store as groupsStore } from '@/routes/groups';

type GroupsCreatePageProps = {
    drp: {
        name: string;
    };
};

export default function GroupsCreate(
    groupsCreatePageProps: GroupsCreatePageProps,
) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('groups.create.head_title')} />
            <div className="flex max-w-xl flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('groups.create.heading')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t('groups.create.intro_before_drp')}{' '}
                        <span className="font-medium text-foreground">
                            {groupsCreatePageProps.drp.name}
                        </span>
                        {t('groups.create.intro_after_drp')}
                    </p>
                </div>

                <Form
                    {...groupsStore.form()}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {(formRenderProps) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="groups-create-title">
                                    {t('groups.create.label.title')}
                                </Label>
                                <Input
                                    id="groups-create-title"
                                    type="text"
                                    name="title"
                                    required
                                    maxLength={255}
                                    autoComplete="off"
                                    placeholder={t(
                                        'groups.create.placeholder.title',
                                    )}
                                />
                                <InputError
                                    message={formRenderProps.errors.title}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="groups-create-external-link">
                                    {t('groups.create.label.external_link')}
                                </Label>
                                <Input
                                    id="groups-create-external-link"
                                    type="url"
                                    name="external_communication_link"
                                    maxLength={2048}
                                    autoComplete="off"
                                    placeholder={t(
                                        'groups.create.placeholder.external_link',
                                    )}
                                />
                                <InputError
                                    message={
                                        formRenderProps.errors
                                            .external_communication_link
                                    }
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    id="groups-create-submit"
                                    type="submit"
                                    disabled={formRenderProps.processing}
                                >
                                    {formRenderProps.processing && (
                                        <Spinner className="size-4" />
                                    )}
                                    {t('groups.create.submit')}
                                </Button>
                                <Button
                                    id="groups-create-cancel"
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        router.visit(dashboard.url());
                                    }}
                                >
                                    {t('groups.create.cancel')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

GroupsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            titleKey: 'app.shell.breadcrumb.dashboard',
            href: dashboard.url(),
        },
        {
            title: 'Create group',
            titleKey: 'app.shell.breadcrumb.create_group',
            href: groupsCreate.url(),
        },
    ],
};
