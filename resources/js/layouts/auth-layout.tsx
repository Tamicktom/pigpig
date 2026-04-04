//* Libraries imports
import type { ReactNode } from 'react';

//* Layouts imports
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

type AuthLayoutRootProps = {
    titleKey?: string;
    descriptionKey?: string;
    title?: string;
    description?: string;
    children: ReactNode;
};

export default function AuthLayout(props: AuthLayoutRootProps) {
    const { t } = useTranslations();
    const title = props.titleKey ? t(props.titleKey) : (props.title ?? '');
    const description = props.descriptionKey
        ? t(props.descriptionKey)
        : (props.description ?? '');

    return (
        <AuthLayoutTemplate title={title} description={description}>
            {props.children}
        </AuthLayoutTemplate>
    );
}
