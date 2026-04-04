//* Libraries imports
import { Form } from '@inertiajs/react';
import { useRef } from 'react';

//* Actions imports
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';

//* Components imports
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

export default function DeleteUser() {
    const { t } = useTranslations();
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title={t('auth.delete_account.heading_title')}
                description={t('auth.delete_account.heading_description')}
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">
                        {t('auth.delete_account.warning_title')}
                    </p>
                    <p className="text-sm">
                        {t('auth.delete_account.warning_body')}
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            id="delete-user-open-dialog-button"
                            type="button"
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            {t('auth.delete_account.open_dialog')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            {t('auth.delete_account.dialog_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('auth.delete_account.dialog_description')}
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            {t('auth.common.password')}
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder={t(
                                                'auth.delete_account.password_placeholder',
                                            )}
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                id="delete-user-cancel-button"
                                                type="button"
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                {t(
                                                    'auth.delete_account.cancel',
                                                )}
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                id="confirm-delete-user-button"
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                {t(
                                                    'auth.delete_account.confirm_submit',
                                                )}
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
