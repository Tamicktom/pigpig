//* Libraries imports
import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';

//* Hooks imports
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';

//* Lib imports
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { t } = useTranslations();
    const { appearance, updateAppearance } = useAppearance();

    const tabs: {
        value: Appearance;
        icon: LucideIcon;
        labelKey: string;
    }[] = [
        {
            value: 'light',
            icon: Sun,
            labelKey: 'settings.appearance.tab_light',
        },
        {
            value: 'dark',
            icon: Moon,
            labelKey: 'settings.appearance.tab_dark',
        },
        {
            value: 'system',
            icon: Monitor,
            labelKey: 'settings.appearance.tab_system',
        },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            {...props}
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.value}
                        id={`settings-appearance-tab-${tab.value}`}
                        type="button"
                        onClick={() => updateAppearance(tab.value)}
                        className={cn(
                            'flex items-center gap-1.5 rounded-md px-3.5 py-1.5 transition-colors',
                            appearance === tab.value
                                ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                        )}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm">{t(tab.labelKey)}</span>
                    </button>
                );
            })}
        </div>
    );
}
