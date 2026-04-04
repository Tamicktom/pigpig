//* Libraries imports
import { MapPinOff, MessagesSquare } from 'lucide-react';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

export function LandingProblem() {
    const { t } = useTranslations();

    return (
        <section className="bg-surface-container-low py-24">
            <div className="mx-auto max-w-7xl px-8">
                <div className="grid items-center gap-16 md:grid-cols-2">
                    <div>
                        <h2 className="font-headline mb-6 text-4xl font-bold text-primary">
                            {t('landing.problem.title')}
                        </h2>
                        <div className="space-y-6 leading-relaxed text-on-surface-variant">
                            <p>{t('landing.problem.p1')}</p>
                            <p>{t('landing.problem.p2')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="premium-shadow flex h-48 flex-col justify-between rounded-2xl bg-surface p-8">
                            <MessagesSquare
                                aria-hidden
                                className="size-9 text-primary"
                            />
                            <p className="font-bold text-on-surface">
                                {t('landing.problem.card_whatsapp')}
                            </p>
                        </div>
                        <div className="pt-8">
                            <div className="premium-shadow flex h-48 flex-col justify-between rounded-2xl bg-surface p-8">
                                <MapPinOff
                                    aria-hidden
                                    className="size-9 text-primary"
                                />
                                <p className="font-bold text-on-surface">
                                    {t('landing.problem.card_drp')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
