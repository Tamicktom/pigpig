//* Libraries imports
import { useState } from 'react';

//* Components imports
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    const [drpId, setDrpId] = useState('');

    const triggerClassName = cn(
        'w-full min-w-0 text-base md:text-sm',
        props.selectClassName,
    );

    return (
        <div className="grid gap-2">
            <Label htmlFor="drp_id">{t('auth.register.polo_label')}</Label>
            <input type="hidden" name="drp_id" value={drpId} />
            <Select
                value={drpId === '' ? undefined : drpId}
                onValueChange={setDrpId}
            >
                <SelectTrigger
                    id="drp_id"
                    type="button"
                    tabIndex={props.tabIndex}
                    aria-invalid={props.errorMessage ? true : undefined}
                    className={triggerClassName}
                >
                    <SelectValue
                        placeholder={t('auth.register.polo_placeholder')}
                    />
                </SelectTrigger>
                <SelectContent>
                    {props.poloOptions.map((poloOption) => (
                        <SelectItem
                            key={poloOption.id}
                            value={String(poloOption.drp_id)}
                        >
                            {poloOption.name} — {poloOption.drp_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputError message={props.errorMessage} />
        </div>
    );
}
