//* Libraries imports
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

//* Actions imports
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';

//* Components imports
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    const page = usePage();
    const auth = page.props.auth;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Update your name, email, and optional social profile links"
                />

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
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="instagram_url">
                                    Instagram (optional)
                                </Label>

                                <Input
                                    id="instagram_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={
                                        auth.user.instagram_url ?? ''
                                    }
                                    name="instagram_url"
                                    autoComplete="off"
                                    inputMode="url"
                                    placeholder="https://instagram.com/…"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.instagram_url}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="linkedin_url">
                                    LinkedIn (optional)
                                </Label>

                                <Input
                                    id="linkedin_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.linkedin_url ?? ''}
                                    name="linkedin_url"
                                    autoComplete="off"
                                    inputMode="url"
                                    placeholder="https://linkedin.com/in/…"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.linkedin_url}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="twitter_url">
                                    X / Twitter (optional)
                                </Label>

                                <Input
                                    id="twitter_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.twitter_url ?? ''}
                                    name="twitter_url"
                                    autoComplete="off"
                                    inputMode="url"
                                    placeholder="https://x.com/…"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.twitter_url}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to resend the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has
                                                been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    id="settings-profile-save-button"
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">
                                        Saved
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
            href: edit(),
        },
    ],
};
