//* Libraries imports
import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

//* Components imports
import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { regenerateRecoveryCodes } from '@/routes/two-factor';

type TwoFactorRecoveryCodesProps = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorRecoveryCodes(
    twoFactorRecoveryCodesProps: TwoFactorRecoveryCodesProps,
) {
    const { t } = useTranslations();
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes =
        twoFactorRecoveryCodesProps.recoveryCodesList.length > 0 &&
        codesAreVisible;

    const fetchRecoveryCodesRef = useRef(
        twoFactorRecoveryCodesProps.fetchRecoveryCodes,
    );

    useEffect(() => {
        fetchRecoveryCodesRef.current =
            twoFactorRecoveryCodesProps.fetchRecoveryCodes;
    }, [twoFactorRecoveryCodesProps.fetchRecoveryCodes]);

    async function toggleCodesVisibility(): Promise<void> {
        if (
            !codesAreVisible &&
            !twoFactorRecoveryCodesProps.recoveryCodesList.length
        ) {
            await fetchRecoveryCodesRef.current();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }

    useEffect(() => {
        if (!twoFactorRecoveryCodesProps.recoveryCodesList.length) {
            fetchRecoveryCodesRef.current();
        }
    }, [twoFactorRecoveryCodesProps.recoveryCodesList.length]);

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex gap-3">
                    <LockKeyhole className="size-4" aria-hidden="true" />
                    {t('auth.two_factor.recovery_codes.title')}
                </CardTitle>
                <CardDescription>
                    {t('auth.two_factor.recovery_codes.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        id="two-factor-recovery-codes-toggle-button"
                        type="button"
                        onClick={toggleCodesVisibility}
                        className="w-fit"
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIconComponent
                            className="size-4"
                            aria-hidden="true"
                        />
                        {codesAreVisible
                            ? t('auth.two_factor.recovery_codes.hide')
                            : t('auth.two_factor.recovery_codes.view')}
                    </Button>

                    {canRegenerateCodes && (
                        <Form
                            {...regenerateRecoveryCodes.form()}
                            options={{ preserveScroll: true }}
                            onSuccess={
                                twoFactorRecoveryCodesProps.fetchRecoveryCodes
                            }
                        >
                            {({ processing }) => (
                                <Button
                                    id="two-factor-recovery-codes-regenerate-button"
                                    variant="secondary"
                                    type="submit"
                                    disabled={processing}
                                    aria-describedby="regenerate-warning"
                                >
                                    <RefreshCw />{' '}
                                    {t(
                                        'auth.two_factor.recovery_codes.regenerate',
                                    )}
                                </Button>
                            )}
                        </Form>
                    )}
                </div>
                <div
                    id="recovery-codes-section"
                    className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
                    aria-hidden={!codesAreVisible}
                >
                    <div className="mt-3 space-y-3">
                        {twoFactorRecoveryCodesProps.errors?.length ? (
                            <AlertError
                                errors={twoFactorRecoveryCodesProps.errors}
                            />
                        ) : (
                            <>
                                <div
                                    ref={codesSectionRef}
                                    className="grid gap-1 rounded-lg bg-muted p-4 font-mono text-sm"
                                    role="list"
                                    aria-label={t(
                                        'auth.two_factor.recovery_codes.list_aria_label',
                                    )}
                                >
                                    {twoFactorRecoveryCodesProps
                                        .recoveryCodesList.length ? (
                                        twoFactorRecoveryCodesProps.recoveryCodesList.map(
                                            (code, index) => (
                                                <div
                                                    key={index}
                                                    role="listitem"
                                                    className="select-text"
                                                >
                                                    {code}
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div
                                            className="space-y-2"
                                            aria-label={t(
                                                'auth.two_factor.recovery_codes.loading_aria_label',
                                            )}
                                        >
                                            {Array.from(
                                                { length: 8 },
                                                (_, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-4 animate-pulse rounded bg-muted-foreground/20"
                                                        aria-hidden="true"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="text-xs text-muted-foreground select-none">
                                    <p id="regenerate-warning">
                                        {t(
                                            'auth.two_factor.recovery_codes.warning_prefix',
                                        )}
                                        <span className="font-bold">
                                            {t(
                                                'auth.two_factor.recovery_codes.warning_regenerate_label',
                                            )}
                                        </span>
                                        {t(
                                            'auth.two_factor.recovery_codes.warning_suffix',
                                        )}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
