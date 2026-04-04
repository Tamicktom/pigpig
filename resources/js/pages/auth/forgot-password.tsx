// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

type ForgotPasswordPageProps = {
    status?: string;
};

export default function ForgotPassword(props: ForgotPasswordPageProps) {
    return (
        <>
            <Head title="Esqueci a senha" />

            {props.status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {props.status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="flex items-center justify-start pt-6">
                                <Button
                                    id="forgot-password-submit-button"
                                    type="submit"
                                    className="landing-primary-cta h-auto w-full rounded-xl py-3 font-bold tracking-wide text-primary-foreground shadow-none"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Enviar link de redefinição
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-sm text-on-surface-variant">
                    <span>Voltar para </span>
                    <TextLink
                        href={login.url()}
                        className="font-medium text-primary hover:text-primary"
                    >
                        entrar
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Esqueci a senha',
    description:
        'Informe seu e-mail para receber o link de redefinição de senha',
};
