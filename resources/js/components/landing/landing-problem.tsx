//* Libraries imports
import { MapPinOff, MessagesSquare } from 'lucide-react';

export function LandingProblem() {
    return (
        <section className="bg-surface-container-low py-24">
            <div className="mx-auto max-w-7xl px-8">
                <div className="grid items-center gap-16 md:grid-cols-2">
                    <div>
                        <h2 className="font-headline mb-6 text-4xl font-bold text-primary">
                            O Desafio da Formação de Grupos
                        </h2>
                        <div className="space-y-6 leading-relaxed text-on-surface-variant">
                            <p>
                                A fragmentação digital é o maior obstáculo para
                                os alunos da UNIVESP. Atualmente, a busca por
                                colegas de curso depende de dezenas de grupos de
                                WhatsApp informais, onde mensagens importantes se
                                perdem em segundos.
                            </p>
                            <p>
                                Encontrar colegas da mesma região (DRP)
                                torna-se uma tarefa exaustiva, gerando ansiedade
                                e atrasos no início das atividades acadêmicas
                                cruciais para o Projeto Integrador.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="premium-shadow flex h-48 flex-col justify-between rounded-2xl bg-surface p-8">
                            <MessagesSquare
                                aria-hidden
                                className="size-9 text-primary"
                            />
                            <p className="font-bold text-on-surface">
                                Fragmentação no WhatsApp
                            </p>
                        </div>
                        <div className="pt-8">
                            <div className="premium-shadow flex h-48 flex-col justify-between rounded-2xl bg-surface p-8">
                                <MapPinOff
                                    aria-hidden
                                    className="size-9 text-primary"
                                />
                                <p className="font-bold text-on-surface">
                                    Dificuldade com DRPs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
