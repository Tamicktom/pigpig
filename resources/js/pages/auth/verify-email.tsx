//* Libraries imports
import { Form, Head } from '@inertiajs/react';

//* Components imports
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { logout } from '@/routes';
import { send } from '@/routes/verification';

type VerifyEmailPageProps = {
    status?: string;
};

export default function VerifyEmail(props: VerifyEmailPageProps) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('auth.verify_email.head_title')} />

            {props.status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t('auth.verify_email.link_sent_message')}
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            id="auth-verify-email-resend"
                            type="submit"
                            disabled={processing}
                            variant="secondary"
                        >
                            {processing && <Spinner />}
                            {t('auth.verify_email.resend')}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm font-medium text-primary hover:text-primary"
                        >
                            {t('auth.verify_email.sign_out')}
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    titleKey: 'auth.verify_email.layout_title',
    descriptionKey: 'auth.verify_email.layout_description',
};
