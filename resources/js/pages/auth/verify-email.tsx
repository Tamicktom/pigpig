// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

type VerifyEmailPageProps = {
    status?: string;
};

export default function VerifyEmail(props: VerifyEmailPageProps) {
    return (
        <>
            <Head title="Verificação de e-mail" />

            {props.status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Um novo link de verificação foi enviado para o e-mail que você
                    informou no cadastro.
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
                            Reenviar e-mail de verificação
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm font-medium text-primary hover:text-primary"
                        >
                            Sair
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verificar e-mail',
    description:
        'Confirme seu endereço de e-mail clicando no link que acabamos de enviar.',
};
