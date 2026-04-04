//* Libraries imports
import { Link } from '@inertiajs/react';
import { ArrowRight, Verified } from 'lucide-react';

//* Components imports
import { Button } from '@/components/ui/button';

//* Routes imports
import { index as groupsIndex } from '@/routes/groups';

const HERO_IMAGE_SRC =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDq-y07juAjBhSBV2VmUIKh16H_MAZVfn9XTmY9T8OCZrfsFRDA1AY5jXIsrh7Mb29QtfWj8lVvZ_D0HuqKZ6Uo8BS024rUx35AotVAIVfDaetIaVKedQXAc3R8jwo5Dj2I2MRh7PFPv5Fog9GUClaxzj3ajfeh4ottFXog96zznr6pojJh6XHwLcP1qUysev64oTkK3ZIU1i73ogWSUJPTnkdiwDnfScuKOHEsg-aiSMDZI8bc1IFCUU7Z3TpABP-5QH_KaxfG66w';

export function LandingHero() {
    return (
        <section className="relative flex min-h-[870px] items-center overflow-hidden bg-surface px-8 py-20">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
                <div className="z-10">
                    <h1 className="font-headline mb-8 text-5xl leading-tight font-black tracking-tight text-on-background md:text-7xl">
                        Pare de perder tempo procurando grupo para o PI
                    </h1>
                    <p className="mb-10 max-w-lg text-lg leading-relaxed text-on-surface-variant">
                        Conecte-se automaticamente aos colegas da sua DRP de forma
                        rápida e organizada. Chega de estresse procurando grupo para o PI.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                            id="landing-hero-cta-polo"
                            type="button"
                            className="landing-primary-cta h-auto rounded-xl px-8 py-4 font-bold tracking-wide text-primary-foreground shadow-none"
                            asChild
                        >
                            <Link
                                href={groupsIndex.url()}
                                className="inline-flex items-center justify-center gap-2"
                            >
                                Selecionar meu Polo
                                <ArrowRight
                                    aria-hidden
                                    className="size-5 shrink-0"
                                />
                            </Link>
                        </Button>
                        <Button
                            id="landing-hero-cta-learn"
                            type="button"
                            variant="ghost"
                            className="ghost-border h-auto rounded-xl px-8 py-4 font-bold text-primary shadow-none hover:bg-surface-container-low"
                            asChild
                        >
                            <a href="#como-funciona">Saiba Mais</a>
                        </Button>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -top-12 -right-12 size-64 rounded-full bg-primary-container/10 blur-3xl" />
                    <div className="relative z-10 rotate-3 overflow-hidden rounded-4xl shadow-2xl motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:hover:rotate-0">
                        <img
                            src={HERO_IMAGE_SRC}
                            alt="Estudantes colaborando em ambiente universitário iluminado"
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
                                Pólos Oficiais
                            </p>
                            <p className="text-sm text-on-surface-variant">
                                Catanduva, Fernandópolis, Jales
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
