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

export default function Register(registerPageProps: RegisterPageProps) {
    return (
        <>
            <Head title="Register" />
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
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={formRenderProps.errors.name}
                                    className="pt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
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
                                <Label htmlFor="phone">Phone</Label>
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
                                poloOptions={registerPageProps.polos}
                                errorMessage={formRenderProps.errors.drp_id}
                                tabIndex={4}
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError
                                    message={formRenderProps.errors.password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
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
                                className="w-full"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {formRenderProps.processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={8}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
