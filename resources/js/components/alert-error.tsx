//* Libraries imports
import { AlertCircleIcon } from 'lucide-react';

//* Components imports
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

//* Lib imports
import { useTranslations } from '@/lib/i18n';

type AlertErrorProps = {
    errors: string[];
    title?: string;
};

export default function AlertError(props: AlertErrorProps) {
    const { t } = useTranslations();

    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>
                {props.title ?? t('app.alert_error.default_title')}
            </AlertTitle>
            <AlertDescription>
                <ul className="list-inside list-disc text-sm">
                    {Array.from(new Set(props.errors)).map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    );
}
