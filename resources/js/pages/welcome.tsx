//* Libraries imports
import { Head, usePage } from '@inertiajs/react';

//* Components imports
import { EmailVerificationBanner } from '@/components/email-verification-banner';
import { LandingAbout } from '@/components/landing/landing-about';
import { LandingBenefits } from '@/components/landing/landing-benefits';
import { LandingCta } from '@/components/landing/landing-cta';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingHowItWorks } from '@/components/landing/landing-how-it-works';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingProblem } from '@/components/landing/landing-problem';

//* Hooks imports
import { useTranslations } from '@/lib/i18n';

type WelcomeProps = {
    canRegister?: boolean;
};

export default function Welcome() {
    const page = usePage<WelcomeProps & { name: string }>();
    const appName = page.props.name;
    const canRegister = page.props.canRegister ?? false;
    const isAuthenticated = page.props.auth.user !== null;
    const { t } = useTranslations();

    return (
        <>
            <Head title={t('landing.head_title_suffix')} />
            <div className="min-w-0 overflow-x-hidden bg-background">
                <div className="w-full self-stretch">
                    <EmailVerificationBanner variant="public" />
                </div>
                <LandingNav
                    appName={appName}
                    canRegister={canRegister}
                    isAuthenticated={isAuthenticated}
                />
                <main className="min-w-0 pt-20">
                    <LandingHero />
                    <LandingProblem />
                    <LandingHowItWorks />
                    <LandingBenefits />
                    <LandingAbout />
                    <LandingCta />
                </main>
                <LandingFooter appName={appName} />
            </div>
        </>
    );
}
