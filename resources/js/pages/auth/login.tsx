import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type LoginPageProps = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login(props: LoginPageProps) {
    return (
        <>
            <Head title="Entrar" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                    {props.canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm font-medium text-primary hover:text-primary"
                                            tabIndex={5}
                                        >
                                            Esqueceu a senha?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Senha"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Lembrar-me</Label>
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
                                Entrar
                            </Button>
                        </div>

                        {props.canRegister && (
                            <div className="text-center text-sm text-on-surface-variant">
                                Não tem uma conta?{' '}
                                <TextLink
                                    href={register.url()}
                                    tabIndex={5}
                                    className="font-medium text-primary hover:text-primary"
                                >
                                    Cadastrar
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
    title: 'Entrar na sua conta',
    description: 'Informe seu e-mail e senha para entrar',
};
