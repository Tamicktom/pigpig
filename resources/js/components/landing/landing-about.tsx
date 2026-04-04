//* Hooks imports
import { useTranslations } from '@/lib/i18n';

export function LandingAbout() {
    const { t } = useTranslations();

    const teamMembers = [
        'Henrique Angelo Vieira Fonseca',
        'Joel Pereira Ramos',
        'Carlos Alberto Angelo',
        'Maita Nogueira Barbosa',
        'Gustavo de Faria Guedes',
        'Marcelo Geromel Teles',
        'Eduardo de Queiroz Pigari',
        'Viviane Ortega Bella Bernardis',
    ];

    return (
        <section className="bg-surface-container-lowest py-24" id="sobre">
            <div className="mx-auto max-w-7xl px-8">
                <div className="grid gap-20 md:grid-cols-2">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-primary uppercase">
                            {t('landing.about.initiative_badge')}
                        </span>
                        <h2 className="font-headline mt-4 mb-8 text-4xl font-bold text-on-surface">
                            {t('landing.about.title')}
                        </h2>
                        <p className="mb-6 leading-relaxed text-on-surface-variant">
                            {t('landing.about.body', {
                                cities: t('landing.about.cities'),
                            })}
                        </p>
                        <div className="rounded-2xl border-l-4 border-primary bg-surface-container p-6">
                            <p className="mb-2 text-xs font-bold tracking-widest text-primary uppercase">
                                {t('landing.about.guidance_badge')}
                            </p>
                            <p className="font-headline text-xl font-bold text-on-surface">
                                {t('landing.about.advisor_name')}
                            </p>
                        </div>
                    </div>
                    <div id="equipe">
                        <h3 className="font-headline mb-8 text-2xl font-bold text-on-surface">
                            {t('landing.about.team_title')}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {teamMembers.map((memberName) => (
                                <div
                                    key={memberName}
                                    className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4"
                                >
                                    <div
                                        className="size-2 shrink-0 rounded-full bg-secondary"
                                        aria-hidden
                                    />
                                    <span className="text-sm font-medium text-on-surface">
                                        {memberName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
