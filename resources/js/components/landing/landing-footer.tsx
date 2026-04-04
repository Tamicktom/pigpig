type LandingFooterProps = {
    appName: string;
};

export function LandingFooter(landingFooterProps: LandingFooterProps) {
    const appName = landingFooterProps.appName;

    return (
        <footer
            id="contato"
            className="w-full border-t border-landing-footer-foreground/10 bg-landing-footer py-12 px-8 text-landing-footer-foreground"
        >
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
                <div className="font-headline text-lg font-bold">
                    {appName}
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    <a
                        href="#"
                        className="text-sm tracking-wide text-landing-footer-foreground/60 transition-colors duration-200 ease-out hover:text-landing-footer-foreground"
                    >
                        Privacidade
                    </a>
                    <a
                        href="#"
                        className="text-sm tracking-wide text-landing-footer-foreground/60 transition-colors duration-200 ease-out hover:text-landing-footer-foreground"
                    >
                        Termos de Uso
                    </a>
                    <a
                        href="#"
                        className="text-sm tracking-wide text-landing-footer-foreground/60 transition-colors duration-200 ease-out hover:text-landing-footer-foreground"
                    >
                        Documentação
                    </a>
                </div>
                <p className="text-center text-sm tracking-wide text-landing-footer-foreground/80 md:text-right">
                    © {new Date().getFullYear()} Projeto Integrador UNIVESP.
                    Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
