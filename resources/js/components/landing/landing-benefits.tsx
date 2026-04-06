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
            <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-8">
                <div className="editorial-grid w-full min-w-0 gap-12">
                    <div className="col-span-12 min-w-0 md:col-span-4">
                        <h2 className="font-headline mb-8 text-3xl leading-tight font-bold wrap-break-word text-balance sm:text-4xl md:text-5xl">
                            {t('landing.benefits.title')}
                        </h2>
                        <div className="h-1 w-20 rounded-full bg-primary" />
                    </div>
                    <div className="col-span-12 grid min-w-0 gap-8 md:col-span-8 md:grid-cols-2">
                        <div className="ghost-border min-w-0 w-full max-w-full overflow-hidden rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Bolt
                                aria-hidden
                                className="mb-4 size-9 shrink-0 text-secondary"
                            />
                            <h4 className="mb-2 max-w-full text-xl font-bold wrap-anywhere">
                                {t('landing.benefits.instant_title')}
                            </h4>
                            <p className="max-w-full min-w-0 leading-relaxed wrap-anywhere text-editorial-muted">
                                {t('landing.benefits.instant_body')}
                            </p>
                        </div>
                        <div className="ghost-border min-w-0 w-full max-w-full overflow-hidden rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Focus
                                aria-hidden
                                className="mb-4 size-9 shrink-0 text-secondary"
                            />
                            <h4 className="mb-2 max-w-full text-xl font-bold wrap-anywhere">
                                {t('landing.benefits.central_title')}
                            </h4>
                            <p className="max-w-full min-w-0 leading-relaxed wrap-anywhere text-editorial-muted">
                                {t('landing.benefits.central_body')}
                            </p>
                        </div>
                        <div className="ghost-border min-w-0 w-full max-w-full overflow-hidden rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Smile
                                aria-hidden
                                className="mb-4 size-9 shrink-0 text-secondary"
                            />
                            <h4 className="mb-2 max-w-full text-xl font-bold wrap-anywhere">
                                {t('landing.benefits.stress_title')}
                            </h4>
                            <p className="max-w-full min-w-0 leading-relaxed wrap-anywhere text-editorial-muted">
                                {t('landing.benefits.stress_body')}
                            </p>
                        </div>
                        <div className="ghost-border min-w-0 w-full max-w-full overflow-anywhere rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <GraduationCap
                                aria-hidden
                                className="mb-4 size-9 shrink-0 text-secondary"
                            />
                            <h4 className="mb-2 max-w-full text-xl font-bold wrap-anywhere">
                                {t('landing.benefits.academic_title')}
                            </h4>
                            <p className="max-w-full min-w-0 leading-relaxed wrap-anywhere text-editorial-muted">
                                {t('landing.benefits.academic_body')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
