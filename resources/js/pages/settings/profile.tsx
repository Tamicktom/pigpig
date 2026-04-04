//* Libraries imports
import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';

//* Actions imports
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';

//* Components imports
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { t } = useTranslations();
    const page = usePage();
    const auth = page.props.auth;
    const user = auth.user;

    return (
        <>
            <Head title={t('settings.profile.head_title')} />

            <h1 className="sr-only">{t('settings.profile.head_title')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.profile.heading_title')}
                    description={t('settings.profile.heading_description')}
                />

                {mustVerifyEmail &&
                    user !== null &&
                    user.email_verified_at === null && (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                {t('settings.profile.email_unverified')}
                            </p>
                            <Form
                                {...send.form()}
                                options={{ preserveScroll: true }}
                                className="inline-block"
                            >
                                {(sendFormProps) => (
                                    <Button
                                        id="settings-profile-resend-verification"
                                        type="submit"
                                        disabled={sendFormProps.processing}
                                        variant="secondary"
                                    >
                                        {sendFormProps.processing ? (
                                            <Spinner />
                                        ) : null}
                                        {t(
                                            'settings.profile.resend_verification',
                                        )}
                                    </Button>
                                )}
                            </Form>
                            {status === 'verification-link-sent' && (
                                <p className="text-sm font-medium text-green-600">
                                    {t(
                                        'settings.profile.verification_link_sent',
                                    )}
                                </p>
                            )}
                        </div>
                    )}

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    {t('settings.profile.label.name')}
                                </Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={user?.name ?? ''}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder={t(
                                        'settings.profile.placeholder.name',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('settings.profile.label.email')}
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={user?.email ?? ''}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder={t(
                                        'settings.profile.placeholder.email',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="instagram_url">
                                    {t('settings.profile.label.instagram')}
                                </Label>

                                <Input
                                    id="instagram_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={user?.instagram_url ?? ''}
                                    name="instagram_url"
                                    autoComplete="off"
                                    inputMode="url"
                                    placeholder={t(
                                        'settings.profile.placeholder.instagram',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.instagram_url}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="linkedin_url">
                                    {t('settings.profile.label.linkedin')}
                                </Label>

                                <Input
                                    id="linkedin_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={user?.linkedin_url ?? ''}
                                    name="linkedin_url"
                                    autoComplete="off"
                                    inputMode="url"
                                    placeholder={t(
                                        'settings.profile.placeholder.linkedin',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.linkedin_url}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="twitter_url">
                                    {t('settings.profile.label.twitter')}
                                </Label>

                                <Input
                                    id="twitter_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={user?.twitter_url ?? ''}
                                    name="twitter_url"
                                    autoComplete="off"
                                    inputMode="url"
                                    placeholder={t(
                                        'settings.profile.placeholder.twitter',
                                    )}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.twitter_url}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    id="settings-profile-save-button"
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    {t('settings.common.save')}
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">
                                        {t('settings.common.saved')}
                                    </p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            titleKey: 'app.shell.breadcrumb.profile_settings',
            href: edit(),
        },
    ],
};
