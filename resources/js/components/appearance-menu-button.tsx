//* Libraries imports
import { Monitor, Moon, Sun } from 'lucide-react';

//* Components imports
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

//* Hooks imports
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';

//* Lib imports
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type AppearanceMenuButtonProps = {
    triggerId: string;
    triggerClassName?: string;
    align?: 'start' | 'center' | 'end';
};

export function AppearanceMenuButton(props: AppearanceMenuButtonProps) {
    const triggerId = props.triggerId;
    const triggerClassName = props.triggerClassName;
    const align = props.align ?? 'end';
    const { t } = useTranslations();
    const { appearance, updateAppearance } = useAppearance();

    const TriggerIcon =
        appearance === 'light'
            ? Sun
            : appearance === 'dark'
              ? Moon
              : Monitor;

    const handleValueChange = (value: string): void => {
        updateAppearance(value as Appearance);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    id={triggerId}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn('h-9 w-9', triggerClassName)}
                    aria-label={t('app.shell.theme.menu_trigger_aria')}
                >
                    <TriggerIcon className="size-5 opacity-80" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40" align={align}>
                <DropdownMenuRadioGroup
                    value={appearance}
                    onValueChange={handleValueChange}
                >
                    <DropdownMenuRadioItem
                        id={`${triggerId}-option-light`}
                        value="light"
                    >
                        <Sun className="size-4" />
                        {t('settings.appearance.tab_light')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        id={`${triggerId}-option-dark`}
                        value="dark"
                    >
                        <Moon className="size-4" />
                        {t('settings.appearance.tab_dark')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        id={`${triggerId}-option-system`}
                        value="system"
                    >
                        <Monitor className="size-4" />
                        {t('settings.appearance.tab_system')}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
