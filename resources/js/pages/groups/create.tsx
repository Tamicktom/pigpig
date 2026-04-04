//* Libraries imports
import { Form, Head, router } from '@inertiajs/react';

//* Components imports
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

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
    return (
        <>
            <Head title="Create group" />
            <div className="flex max-w-xl flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create group
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Your group will be created in{' '}
                        <span className="font-medium text-foreground">
                            {groupsCreatePageProps.drp.name}
                        </span>
                        . You cannot assign a different DRP.
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
                                    Title
                                </Label>
                                <Input
                                    id="groups-create-title"
                                    type="text"
                                    name="title"
                                    required
                                    maxLength={255}
                                    autoComplete="off"
                                    placeholder="Project integrator topic"
                                />
                                <InputError
                                    message={formRenderProps.errors.title}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="groups-create-external-link">
                                    External communication link (optional)
                                </Label>
                                <Input
                                    id="groups-create-external-link"
                                    type="url"
                                    name="external_communication_link"
                                    maxLength={2048}
                                    autoComplete="off"
                                    placeholder="https://chat.example.com/invite"
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
                                    Create group
                                </Button>
                                <Button
                                    id="groups-create-cancel"
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        router.visit(dashboard.url());
                                    }}
                                >
                                    Cancel
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
