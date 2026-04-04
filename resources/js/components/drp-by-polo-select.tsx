//* Components imports
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

//* Lib imports
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type PoloDrpOption = {
    id: number;
    name: string;
    drp_id: number;
    drp_name: string;
};

type DrpByPoloSelectProps = {
    poloOptions: PoloDrpOption[];
    errorMessage?: string;
    tabIndex?: number;
    selectClassName?: string;
};

/**
 * Registration control: user picks their polo by name; the form submits `drp_id`.
 */
export function DrpByPoloSelect(props: DrpByPoloSelectProps) {
    const { t } = useTranslations();
    const selectClassName = cn(
        'flex h-9 w-full min-w-0 px-3 py-1 text-base text-foreground outline-none md:text-sm',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        props.selectClassName,
    );

    return (
        <div className="grid gap-2">
            <Label htmlFor="drp_id">{t('auth.register.polo_label')}</Label>
            <select
                id="drp_id"
                name="drp_id"
                required
                tabIndex={props.tabIndex}
                defaultValue=""
                className={selectClassName}
                aria-invalid={props.errorMessage ? true : undefined}
            >
                <option value="" disabled>
                    {t('auth.register.polo_placeholder')}
                </option>
                {props.poloOptions.map((poloOption) => (
                    <option key={poloOption.id} value={poloOption.drp_id}>
                        {poloOption.name} — {poloOption.drp_name}
                    </option>
                ))}
            </select>
            <InputError message={props.errorMessage} />
        </div>
    );
}
