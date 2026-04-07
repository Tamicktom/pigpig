//* Libraries imports
import { Link } from '@inertiajs/react';
import { ArrowRight, Verified } from 'lucide-react';

//* Components imports
import { Button, buttonVariants } from '@/components/ui/button';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

//* Routes imports
import { index as groupsIndex } from '@/routes/groups';

//* Utils imports
import { cn } from '@/lib/utils';

const HERO_IMAGE_SRC =
    '/cta.png';

export function LandingHero() {
    const { t } = useTranslations();

    return (
        <section className="relative flex min-h-[870px] items-center overflow-hidden bg-surface px-8 py-20">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
                <div className="z-10">
                    <h1 className="font-headline mb-8 text-5xl leading-tight font-black tracking-tight text-on-background md:text-7xl">
                        {t('landing.hero.title')}
                    </h1>
                    <p className="mb-10 max-w-lg text-lg leading-relaxed text-on-surface-variant">
                        {t('landing.hero.subtitle')}
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                            id="landing-hero-cta-polo"
                            href={groupsIndex.url()}
                            className={
                                cn(
                                    buttonVariants({ variant: 'default' }),
                                    "landing-primary-cta h-auto rounded-xl px-8 py-4 font-bold tracking-wide text-primary-foreground shadow-none"
                                )
                            }
                        >
                            {t('landing.hero.cta_polo')}
                            <ArrowRight
                                aria-hidden
                                className="size-5 shrink-0"
                            />
                        </Link>

                        <Link href="#como-funciona"
                            className={cn(buttonVariants({ variant: 'ghost' }), 'ghost-border h-auto rounded-xl px-8 py-4 font-bold text-primary shadow-none hover:bg-surface-container-low')}
                        >
                            {t('landing.hero.cta_learn')}
                        </Link>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -top-12 -right-12 size-64 rounded-full bg-primary-container/10 blur-3xl" />
                    <div className="relative z-10 rotate-3 overflow-hidden motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:hover:rotate-0">
                        <img
                            src={HERO_IMAGE_SRC}
                            alt={t('landing.hero.image_alt')}
                            className="h-[500px] w-full object-cover"
                            width={800}
                            height={500}
                        />
                    </div>
                    <div className="premium-shadow absolute -bottom-6 -left-6 z-20 flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-6">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary">
                            <Verified aria-hidden className="size-6" />
                        </div>
                        <div>
                            <p className="font-bold text-on-surface">
                                {t('landing.hero.official_poles_title')}
                            </p>
                            <p className="text-sm text-on-surface-variant">
                                {t('landing.hero.official_poles_cities')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
