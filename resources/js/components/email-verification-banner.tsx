//* Libraries imports
import { Form, usePage } from '@inertiajs/react';

//* Components imports
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

//* Routes imports
import { send } from '@/routes/verification';

type EmailVerificationBannerProps = {
    variant?: 'app' | 'public';
};

export function EmailVerificationBanner(
    emailVerificationBannerProps: EmailVerificationBannerProps,
) {
    const page = usePage<{
        auth: { user: unknown; needsEmailVerification: boolean };
        status?: string;
    }>();
    const variant = emailVerificationBannerProps.variant ?? 'app';

    if (
        !page.props.auth.user ||
        !page.props.auth.needsEmailVerification
    ) {
        return null;
    }

    const status = page.props.status;
    const isPublic = variant === 'public';

    return (
        <div
            className={
                isPublic
                    ? 'border-b border-amber-500/40 bg-amber-50 px-6 py-3 text-[#1b1b18] dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-[#EDEDEC]'
                    : 'border-b border-amber-500/40 bg-amber-50 px-4 py-3 text-foreground dark:border-amber-500/30 dark:bg-amber-950/40'
            }
            role="region"
            aria-label="Email verification required"
        >
            <div
                className={
                    isPublic
                        ? 'mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
                        : 'flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
                }
            >
                <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm font-medium">
                        Verify your email to use groups
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-[#A1A09A]">
                        You need to confirm your email address before you can
                        create a group or join one.
                    </p>
                    {status === 'verification-link-sent' ? (
                        <p className="text-sm font-medium text-green-600 dark:text-green-500">
                            A new verification link has been sent to your
                            email address.
                        </p>
                    ) : null}
                </div>
                <Form
                    {...send.form()}
                    options={{ preserveScroll: true }}
                    className="shrink-0"
                >
                    {(formProps) => (
                        <Button
                            id="email-verification-banner-resend"
                            type="submit"
                            disabled={formProps.processing}
                            variant={isPublic ? 'secondary' : 'default'}
                            className={
                                isPublic
                                    ? 'border-[#19140035] dark:border-[#3E3E3A]'
                                    : undefined
                            }
                        >
                            {formProps.processing ? <Spinner /> : null}
                            Resend verification email
                        </Button>
                    )}
                </Form>
            </div>
        </div>
    );
}
