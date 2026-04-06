//* Libraries imports
import { Form, Head } from '@inertiajs/react';

//* Components imports
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('auth.confirm_password.head_title')} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {t('auth.common.password')}
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder={t(
                                    'auth.common.password_placeholder',
                                )}
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                id="confirm-password-submit-button"
                                type="submit"
                                className="landing-primary-cta h-auto w-full rounded-xl py-3 font-bold tracking-wide text-primary-foreground shadow-none"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                {t('auth.confirm_password.submit')}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    titleKey: 'auth.confirm_password.layout_title',
    descriptionKey: 'auth.confirm_password.layout_description',
};
