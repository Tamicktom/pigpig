//* Libraries imports
import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';

//* Components imports
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

//* Hooks imports
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const { t } = useTranslations();
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = showRecoveryInput
        ? {
              title: t('auth.two_factor_challenge.recovery.layout_title'),
              description: t(
                  'auth.two_factor_challenge.recovery.layout_description',
              ),
              toggleText: t('auth.two_factor_challenge.recovery.toggle'),
          }
        : {
              title: t('auth.two_factor_challenge.otp.layout_title'),
              description: t(
                  'auth.two_factor_challenge.otp.layout_description',
              ),
              toggleText: t('auth.two_factor_challenge.otp.toggle'),
          };

    setLayoutProps({
        title: authConfigContent.title,
        description: authConfigContent.description,
    });

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <>
            <Head title={t('auth.two_factor_challenge.head_title')} />

            <div className="space-y-6">
                <Form
                    {...store.form()}
                    className="space-y-4"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <>
                                    <Input
                                        name="recovery_code"
                                        type="text"
                                        placeholder={t(
                                            'auth.two_factor_challenge.recovery_placeholder',
                                        )}
                                        autoFocus={showRecoveryInput}
                                        required
                                    />
                                    <InputError
                                        message={errors.recovery_code}
                                    />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                    <div className="flex w-full items-center justify-center">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                        >
                                            <InputOTPGroup>
                                                {Array.from(
                                                    {
                                                        length: OTP_MAX_LENGTH,
                                                    },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <Button
                                id="two-factor-challenge-submit-button"
                                type="submit"
                                className="landing-primary-cta h-auto w-full rounded-xl py-3 font-bold tracking-wide text-primary-foreground shadow-none"
                                disabled={processing}
                            >
                                {t('auth.two_factor_challenge.submit')}
                            </Button>

                            <div className="text-center text-sm text-on-surface-variant">
                                <span>
                                    {t('auth.two_factor_challenge.or_you_can')}
                                </span>
                                <button
                                    id="two-factor-challenge-toggle-mode-button"
                                    type="button"
                                    className="cursor-pointer text-primary underline decoration-primary/30 underline-offset-4 transition-colors duration-200 ease-out hover:decoration-primary dark:decoration-primary/40"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
