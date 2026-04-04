//* Libraries imports
import { Form } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy, ScanLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

//* Components imports
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';

//* Hooks imports
import { useAppearance } from '@/hooks/use-appearance';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { confirm } from '@/routes/two-factor';

function GridScanIcon() {
    return (
        <div className="mb-3 rounded-full border border-border bg-card p-0.5 shadow-sm">
            <div className="relative overflow-hidden rounded-full border border-border bg-muted p-2.5">
                <div className="absolute inset-0 grid grid-cols-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`col-${i + 1}`}
                            className="border-r border-border last:border-r-0"
                        />
                    ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`row-${i + 1}`}
                            className="border-b border-border last:border-b-0"
                        />
                    ))}
                </div>
                <ScanLine className="relative z-20 size-6 text-foreground" />
            </div>
        </div>
    );
}

type TwoFactorSetupStepProps = {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
};

function TwoFactorSetupStep(twoFactorSetupStepProps: TwoFactorSetupStepProps) {
    const { t } = useTranslations();
    const { resolvedAppearance } = useAppearance();
    const [copiedText, copy] = useClipboard();
    const IconComponent =
        copiedText === twoFactorSetupStepProps.manualSetupKey ? Check : Copy;

    return (
        <>
            {twoFactorSetupStepProps.errors?.length ? (
                <AlertError errors={twoFactorSetupStepProps.errors} />
            ) : (
                <>
                    <div className="mx-auto flex max-w-md overflow-hidden">
                        <div className="mx-auto aspect-square w-64 rounded-lg border border-border">
                            <div className="z-10 flex h-full w-full items-center justify-center p-5">
                                {twoFactorSetupStepProps.qrCodeSvg ? (
                                    <div
                                        className="aspect-square w-full rounded-lg bg-white p-2 [&_svg]:size-full"
                                        dangerouslySetInnerHTML={{
                                            __html: twoFactorSetupStepProps.qrCodeSvg,
                                        }}
                                        style={{
                                            filter:
                                                resolvedAppearance === 'dark'
                                                    ? 'invert(1) brightness(1.5)'
                                                    : undefined,
                                        }}
                                    />
                                ) : (
                                    <Spinner />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full space-x-5">
                        <Button
                            id="two-factor-setup-continue-button"
                            type="button"
                            className="w-full"
                            onClick={twoFactorSetupStepProps.onNextStep}
                        >
                            {twoFactorSetupStepProps.buttonText}
                        </Button>
                    </div>

                    <div className="relative flex w-full items-center justify-center">
                        <div className="absolute inset-0 top-1/2 h-px w-full bg-border" />
                        <span className="relative bg-card px-2 py-1">
                            {t('auth.two_factor.setup.manual_divider')}
                        </span>
                    </div>

                    <div className="flex w-full space-x-2">
                        <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-border">
                            {!twoFactorSetupStepProps.manualSetupKey ? (
                                <div className="flex h-full w-full items-center justify-center bg-muted p-3">
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        readOnly
                                        value={
                                            twoFactorSetupStepProps.manualSetupKey
                                        }
                                        className="h-full w-full bg-background p-3 text-foreground outline-none"
                                    />
                                    <button
                                        id="two-factor-setup-copy-key-button"
                                        type="button"
                                        onClick={() =>
                                            copy(
                                                twoFactorSetupStepProps.manualSetupKey ??
                                                    '',
                                            )
                                        }
                                        className="border-l border-border px-3 hover:bg-muted"
                                    >
                                        <IconComponent className="w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

type TwoFactorVerificationStepProps = {
    onClose: () => void;
    onBack: () => void;
};

function TwoFactorVerificationStep(
    twoFactorVerificationStepProps: TwoFactorVerificationStepProps,
) {
    const { t } = useTranslations();
    const [code, setCode] = useState<string>('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            pinInputContainerRef.current?.querySelector('input')?.focus();
        }, 0);
    }, []);

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => twoFactorVerificationStepProps.onClose()}
            resetOnError
            resetOnSuccess
        >
            {({
                processing,
                errors,
            }: {
                processing: boolean;
                errors?: { confirmTwoFactorAuthentication?: { code?: string } };
            }) => (
                <>
                    <div
                        ref={pinInputContainerRef}
                        className="relative w-full space-y-3"
                    >
                        <div className="flex w-full flex-col items-center space-y-3 py-2">
                            <InputOTP
                                id="otp"
                                name="code"
                                maxLength={OTP_MAX_LENGTH}
                                onChange={setCode}
                                disabled={processing}
                                pattern={REGEXP_ONLY_DIGITS}
                            >
                                <InputOTPGroup>
                                    {Array.from(
                                        { length: OTP_MAX_LENGTH },
                                        (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                            />
                                        ),
                                    )}
                                </InputOTPGroup>
                            </InputOTP>
                            <InputError
                                message={
                                    errors?.confirmTwoFactorAuthentication?.code
                                }
                            />
                        </div>

                        <div className="flex w-full space-x-5">
                            <Button
                                id="two-factor-verify-back-button"
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={twoFactorVerificationStepProps.onBack}
                                disabled={processing}
                            >
                                {t('auth.two_factor.setup.verify.back')}
                            </Button>
                            <Button
                                id="two-factor-verify-confirm-button"
                                type="submit"
                                className="flex-1"
                                disabled={
                                    processing || code.length < OTP_MAX_LENGTH
                                }
                            >
                                {t('auth.two_factor.setup.verify.confirm')}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}

type TwoFactorSetupModalProps = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorSetupModal(
    twoFactorSetupModalProps: TwoFactorSetupModalProps,
) {
    const { t } = useTranslations();
    const [showVerificationStep, setShowVerificationStep] =
        useState<boolean>(false);

    let modalConfig: {
        title: string;
        description: string;
        buttonText: string;
    };

    if (twoFactorSetupModalProps.twoFactorEnabled) {
        modalConfig = {
            title: t('auth.two_factor.modal.enabled_title'),
            description: t('auth.two_factor.modal.enabled_description'),
            buttonText: t('auth.two_factor.modal.close'),
        };
    } else if (showVerificationStep) {
        modalConfig = {
            title: t('auth.two_factor.modal.verify_title'),
            description: t('auth.two_factor.modal.verify_description'),
            buttonText: t('auth.two_factor.setup.continue'),
        };
    } else {
        modalConfig = {
            title: t('auth.two_factor.modal.enable_title'),
            description: t('auth.two_factor.modal.enable_description'),
            buttonText: t('auth.two_factor.setup.continue'),
        };
    }

    function resetModalState(): void {
        setShowVerificationStep(false);
        twoFactorSetupModalProps.clearSetupData();
    }

    function handleClose(): void {
        resetModalState();
        twoFactorSetupModalProps.onClose();
    }

    function handleModalNextStep(): void {
        if (twoFactorSetupModalProps.requiresConfirmation) {
            setShowVerificationStep(true);

            return;
        }

        handleClose();
    }

    const fetchSetupDataRef = useRef(twoFactorSetupModalProps.fetchSetupData);

    useEffect(() => {
        fetchSetupDataRef.current = twoFactorSetupModalProps.fetchSetupData;
    }, [twoFactorSetupModalProps.fetchSetupData]);

    useEffect(() => {
        if (
            twoFactorSetupModalProps.isOpen &&
            !twoFactorSetupModalProps.qrCodeSvg
        ) {
            fetchSetupDataRef.current();
        }
    }, [twoFactorSetupModalProps.isOpen, twoFactorSetupModalProps.qrCodeSvg]);

    return (
        <Dialog
            open={twoFactorSetupModalProps.isOpen}
            onOpenChange={(open) => !open && handleClose()}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex items-center justify-center">
                    <GridScanIcon />
                    <DialogTitle>{modalConfig.title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {modalConfig.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-5">
                    {showVerificationStep ? (
                        <TwoFactorVerificationStep
                            onClose={handleClose}
                            onBack={() => setShowVerificationStep(false)}
                        />
                    ) : (
                        <TwoFactorSetupStep
                            qrCodeSvg={twoFactorSetupModalProps.qrCodeSvg}
                            manualSetupKey={
                                twoFactorSetupModalProps.manualSetupKey
                            }
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleModalNextStep}
                            errors={twoFactorSetupModalProps.errors}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
