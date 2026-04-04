//* Libraries imports
import { LogIn, MapPin, UserPlus } from 'lucide-react';

export function LandingHowItWorks() {
    return (
        <section className="bg-surface py-24" id="como-funciona">
            <div className="mx-auto max-w-7xl px-8">
                <div className="mb-16 text-center">
                    <h2 className="font-headline mb-4 text-4xl font-bold text-on-background">
                        Como Funciona
                    </h2>
                    <p className="text-on-surface-variant">
                        Três passos simples para garantir seu grupo oficial.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="group relative rounded-3xl bg-surface-container-low p-8 transition-colors duration-200 ease-out hover:bg-surface-container-high">
                        <div className="pointer-events-none absolute top-4 right-8 text-6xl font-black text-primary-container/20 transition-colors duration-200 ease-out group-hover:text-primary-container/40">
                            01
                        </div>
                        <LogIn
                            aria-hidden
                            className="mb-6 size-10 text-primary"
                        />
                        <h3 className="font-headline mb-4 text-xl font-bold text-on-surface">
                            Acesse a plataforma
                        </h3>
                        <p className="leading-relaxed text-on-surface-variant">
                            Faça login com seu e-mail institucional ou acesse
                            diretamente para ver as opções disponíveis.
                        </p>
                    </div>
                    <div className="group relative rounded-3xl bg-surface-container-low p-8 transition-colors duration-200 ease-out hover:bg-surface-container-high md:mt-12">
                        <div className="pointer-events-none absolute top-4 right-8 text-6xl font-black text-primary-container/20 transition-colors duration-200 ease-out group-hover:text-primary-container/40">
                            02
                        </div>
                        <MapPin
                            aria-hidden
                            className="mb-6 size-10 text-primary"
                        />
                        <h3 className="font-headline mb-4 text-xl font-bold text-on-surface">
                            Selecione seu Polo
                        </h3>
                        <p className="leading-relaxed text-on-surface-variant">
                            Escolha entre os polos de Jales, Catanduva ou
                            Fernandópolis para encontrar seus pares regionais.
                        </p>
                    </div>
                    <div className="group relative rounded-3xl bg-surface-container-low p-8 transition-colors duration-200 ease-out hover:bg-surface-container-high md:mt-24">
                        <div className="pointer-events-none absolute top-4 right-8 text-6xl font-black text-primary-container/20 transition-colors duration-200 ease-out group-hover:text-primary-container/40">
                            03
                        </div>
                        <UserPlus
                            aria-hidden
                            className="mb-6 size-10 text-primary"
                        />
                        <h3 className="font-headline mb-4 text-xl font-bold text-on-surface">
                            Grupo Oficial
                        </h3>
                        <p className="leading-relaxed text-on-surface-variant">
                            Seja direcionado instantaneamente ao canal de
                            comunicação oficial da sua DRP específica.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
