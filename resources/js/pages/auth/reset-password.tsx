//* Libraries imports
import { Form, Head } from '@inertiajs/react';

//* Components imports
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { update } from '@/routes/password';

type ResetPasswordPageProps = {
    token: string;
    email: string;
};

export default function ResetPassword(props: ResetPasswordPageProps) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('auth.reset_password.head_title')} />

            <Form
                {...update.form()}
                transform={(data) => ({
                    ...data,
                    token: props.token,
                    email: props.email,
                })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {t('auth.common.email')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={props.email}
                                className="mt-1 block w-full"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {t('auth.common.password')}
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder={t(
                                    'auth.common.password_placeholder',
                                )}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {t('auth.register.confirm_password')}
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder={t(
                                    'auth.register.confirm_password_placeholder',
                                )}
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            id="reset-password-submit-button"
                            type="submit"
                            className="landing-primary-cta mt-4 h-auto w-full rounded-xl py-3 font-bold tracking-wide text-primary-foreground shadow-none"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            {t('auth.reset_password.submit')}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    titleKey: 'auth.reset_password.layout_title',
    descriptionKey: 'auth.reset_password.layout_description',
};
