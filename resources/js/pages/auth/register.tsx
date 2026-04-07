//* Libraries imports
import { Form, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

//* Components imports
import { DrpByPoloSelect } from '@/components/drp-by-polo-select';
import type { PoloDrpOption } from '@/components/drp-by-polo-select';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { Spinner } from '@/components/ui/spinner';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { login } from '@/routes';
import { store } from '@/routes/register';

type RegisterPageProps = {
    polos: PoloDrpOption[];
    phone?: string | null;
};

export default function Register(props: RegisterPageProps) {
    const { t } = useTranslations();
    const [phone, setPhone] = useState(() => props.phone ?? '');

    // Sync controlled phone with Laravel `old('phone')` after Inertia validation errors (page does not remount).
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- external server input via Inertia props
        setPhone(props.phone ?? '');
    }, [props.phone]);

    return (
        <>
            <Head title={t('auth.register.head_title')} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {(formRenderProps) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    {t('auth.register.name')}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={t(
                                        'auth.register.name_placeholder',
                                    )}
                                />
                                <InputError
                                    message={formRenderProps.errors.name}
                                    className="pt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('auth.common.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={t(
                                        'auth.common.email_placeholder',
                                    )}
                                />
                                <InputError
                                    message={formRenderProps.errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">
                                    {t('auth.register.phone')}
                                </Label>
                                <PhoneInput
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={(nextValue) => {
                                        setPhone(nextValue);
                                    }}
                                    defaultCountry="BR"
                                    countrySelectButtonId="register-phone-country"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    placeholder={t(
                                        'auth.register.phone_placeholder',
                                    )}
                                />
                                <InputError
                                    message={formRenderProps.errors.phone}
                                />
                            </div>

                            <DrpByPoloSelect
                                poloOptions={props.polos}
                                errorMessage={formRenderProps.errors.drp_id}
                                tabIndex={4}
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('auth.common.password')}
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={t(
                                        'auth.common.password_placeholder',
                                    )}
                                />
                                <InputError
                                    message={formRenderProps.errors.password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {t('auth.register.confirm_password')}
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={t(
                                        'auth.register.confirm_password_placeholder',
                                    )}
                                />
                                <InputError
                                    message={
                                        formRenderProps.errors
                                            .password_confirmation
                                    }
                                />
                            </div>

                            <Button
                                id="register-submit-button"
                                type="submit"
                                className="landing-primary-cta h-auto w-full rounded-xl py-3 font-bold tracking-wide text-primary-foreground shadow-none"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {formRenderProps.processing && <Spinner />}
                                {t('auth.register.submit')}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-on-surface-variant">
                            {t('auth.register.have_account')}{' '}
                            <TextLink
                                href={login.url()}
                                tabIndex={8}
                                className="font-medium text-primary hover:text-primary"
                            >
                                {t('auth.register.sign_in')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    titleKey: 'auth.register.layout_title',
    descriptionKey: 'auth.register.layout_description',
};
