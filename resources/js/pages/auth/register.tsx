//* Libraries imports
import { Form, Head } from '@inertiajs/react';

//* Components imports
import { DrpByPoloSelect } from '@/components/drp-by-polo-select';
import type { PoloDrpOption } from '@/components/drp-by-polo-select';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

//* Routes imports
import { login } from '@/routes';
import { store } from '@/routes/register';

type RegisterPageProps = {
    polos: PoloDrpOption[];
};

export default function Register(props: RegisterPageProps) {
    return (
        <>
            <Head title="Cadastrar" />
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
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nome completo"
                                />
                                <InputError
                                    message={formRenderProps.errors.name}
                                    className="pt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError
                                    message={formRenderProps.errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="phone"
                                    placeholder="+55 11 98765-4321"
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
                                <Label htmlFor="password">Senha</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Senha"
                                />
                                <InputError
                                    message={formRenderProps.errors.password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar senha
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirmar senha"
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
                                Criar conta
                            </Button>
                        </div>

                        <div className="text-center text-sm text-on-surface-variant">
                            Já tem uma conta?{' '}
                            <TextLink
                                href={login.url()}
                                tabIndex={8}
                                className="font-medium text-primary hover:text-primary"
                            >
                                Entrar
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Criar uma conta',
    description: 'Preencha os dados abaixo para criar sua conta',
};
