//* Libraries imports
import { Form, Head } from '@inertiajs/react';

//* Components imports
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type LoginPageProps = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login(props: LoginPageProps) {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('auth.login.head_title')} />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('auth.common.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder={t(
                                        'auth.common.email_placeholder',
                                    )}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">
                                        {t('auth.common.password')}
                                    </Label>
                                    {props.canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm font-medium text-primary hover:text-primary"
                                            tabIndex={5}
                                        >
                                            {t('auth.login.forgot_password')}
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={t(
                                        'auth.common.password_placeholder',
                                    )}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">
                                    {t('auth.login.remember_me')}
                                </Label>
                            </div>

                            <Button
                                id="login-submit-button"
                                type="submit"
                                className="landing-primary-cta mt-4 h-auto w-full rounded-xl py-3 font-bold tracking-wide text-primary-foreground shadow-none"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                {t('auth.login.submit')}
                            </Button>
                        </div>

                        {props.canRegister && (
                            <div className="text-center text-sm text-on-surface-variant">
                                {t('auth.login.no_account')}{' '}
                                <TextLink
                                    href={register.url()}
                                    tabIndex={5}
                                    className="font-medium text-primary hover:text-primary"
                                >
                                    {t('auth.login.sign_up')}
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {props.status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {props.status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    titleKey: 'auth.login.layout_title',
    descriptionKey: 'auth.login.layout_description',
};
