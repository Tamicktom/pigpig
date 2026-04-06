//* Libraries imports
import {
    Bolt,
    Focus,
    GraduationCap,
    Smile,
} from 'lucide-react';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

export function LandingBenefits() {
    const { t } = useTranslations();

    return (
        <section className="overflow-hidden bg-editorial-contrast-bg py-24 text-editorial-contrast-fg">
            <div className="mx-auto max-w-7xl px-8">
                <div className="editorial-grid gap-12">
                    <div className="col-span-12 md:col-span-4">
                        <h2 className="font-headline mb-8 text-5xl leading-tight font-bold">
                            {t('landing.benefits.title')}
                        </h2>
                        <div className="h-1 w-20 rounded-full bg-primary" />
                    </div>
                    <div className="col-span-12 grid gap-8 sm:grid-cols-2 md:col-span-8">
                        <div className="ghost-border rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Bolt
                                aria-hidden
                                className="mb-4 size-9 text-secondary"
                            />
                            <h4 className="mb-2 text-xl font-bold">
                                {t('landing.benefits.instant_title')}
                            </h4>
                            <p className="text-editorial-muted">
                                {t('landing.benefits.instant_body')}
                            </p>
                        </div>
                        <div className="ghost-border rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Focus
                                aria-hidden
                                className="mb-4 size-9 text-secondary"
                            />
                            <h4 className="mb-2 text-xl font-bold">
                                {t('landing.benefits.central_title')}
                            </h4>
                            <p className="text-editorial-muted">
                                {t('landing.benefits.central_body')}
                            </p>
                        </div>
                        <div className="ghost-border rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Smile
                                aria-hidden
                                className="mb-4 size-9 text-secondary"
                            />
                            <h4 className="mb-2 text-xl font-bold">
                                {t('landing.benefits.stress_title')}
                            </h4>
                            <p className="text-editorial-muted">
                                {t('landing.benefits.stress_body')}
                            </p>
                        </div>
                        <div className="ghost-border rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <GraduationCap
                                aria-hidden
                                className="mb-4 size-9 text-secondary"
                            />
                            <h4 className="mb-2 text-xl font-bold">
                                {t('landing.benefits.academic_title')}
                            </h4>
                            <p className="text-editorial-muted">
                                {t('landing.benefits.academic_body')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
