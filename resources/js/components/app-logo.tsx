//* Components imports
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
                <AppLogoIcon className="size-full" alt="" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    PigPig
                </span>
            </div>
        </>
    );
}
