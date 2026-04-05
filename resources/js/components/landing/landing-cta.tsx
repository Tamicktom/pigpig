//* Libraries imports
import { Link } from '@inertiajs/react';

//* Components imports
import { Button } from '@/components/ui/button';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { index as groupsIndex } from '@/routes/groups';

export function LandingCta() {
    const { t } = useTranslations();

    return (
        <section className="py-24">
            <div className="mx-auto max-w-5xl px-8">
                <div className="relative overflow-hidden rounded-[3rem] bg-primary p-12 text-center shadow-2xl md:p-20">
                    <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-container opacity-50" />
                    <div className="relative z-10">
                        <h2 className="font-headline mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
                            {t('landing.cta.title')}
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80">
                            {t('landing.cta.subtitle')}
                        </p>
                        <Button
                            id="landing-final-cta-polo"
                            type="button"
                            className="rounded-full bg-surface-container-lowest px-10 py-5 font-black text-lg text-primary shadow-xl transition-[background-color,color,box-shadow,transform] duration-200 ease hover:bg-surface-container-low hover:text-primary dark:hover:bg-surface-container-high motion-safe:hover:scale-105 motion-safe:active:scale-95"
                            asChild
                        >
                            <Link href={groupsIndex.url()}>
                                {t('landing.hero.cta_polo')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
