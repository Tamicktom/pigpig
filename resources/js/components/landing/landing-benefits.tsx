//* Libraries imports
import {
    Bolt,
    Focus,
    GraduationCap,
    Smile,
} from 'lucide-react';

export function LandingBenefits() {
    return (
        <section className="overflow-hidden bg-editorial-contrast-bg py-24 text-editorial-contrast-fg">
            <div className="mx-auto max-w-7xl px-8">
                <div className="editorial-grid gap-12">
                    <div className="col-span-12 md:col-span-4">
                        <h2 className="font-headline mb-8 text-5xl leading-tight font-bold">
                            Por que usar nossa rede?
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
                                Formação Instantânea
                            </h4>
                            <p className="text-editorial-muted">
                                Elimine dias de espera. Encontre seu grupo em
                                segundos com automação inteligente.
                            </p>
                        </div>
                        <div className="ghost-border rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Focus
                                aria-hidden
                                className="mb-4 size-9 text-secondary"
                            />
                            <h4 className="mb-2 text-xl font-bold">
                                Comunicação Centralizada
                            </h4>
                            <p className="text-editorial-muted">
                                Um único ponto de verdade. Chega de navegar por
                                15 grupos diferentes.
                            </p>
                        </div>
                        <div className="ghost-border rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <Smile
                                aria-hidden
                                className="mb-4 size-9 text-secondary"
                            />
                            <h4 className="mb-2 text-xl font-bold">
                                Redução de Estresse
                            </h4>
                            <p className="text-editorial-muted">
                                Foque no que importa. Nós resolvemos a logística
                                para você focar no estudo.
                            </p>
                        </div>
                        <div className="ghost-border rounded-2xl p-6 transition-colors duration-200 ease-out hover:bg-white/5">
                            <GraduationCap
                                aria-hidden
                                className="mb-4 size-9 text-secondary"
                            />
                            <h4 className="mb-2 text-xl font-bold">
                                Foco no Acadêmico
                            </h4>
                            <p className="text-editorial-muted">
                                Maximize seu tempo desenvolvendo o projeto, não
                                procurando pessoas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
