//* Components imports
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

//* Lib imports
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
};

/**
 * Registration control: user picks their polo by name; the form submits `drp_id`.
 */
export function DrpByPoloSelect(drpByPoloSelectProps: DrpByPoloSelectProps) {
    const selectClassName = cn(
        'border-input text-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    );

    return (
        <div className="grid gap-2">
            <Label htmlFor="drp_id">Polo (your regional unit)</Label>
            <select
                id="drp_id"
                name="drp_id"
                required
                tabIndex={drpByPoloSelectProps.tabIndex}
                defaultValue=""
                className={selectClassName}
                aria-invalid={
                    drpByPoloSelectProps.errorMessage ? true : undefined
                }
            >
                <option value="" disabled>
                    Select your polo
                </option>
                {drpByPoloSelectProps.poloOptions.map((poloOption) => (
                    <option
                        key={poloOption.id}
                        value={poloOption.drp_id}
                    >
                        {poloOption.name} — {poloOption.drp_name}
                    </option>
                ))}
            </select>
            <InputError message={drpByPoloSelectProps.errorMessage} />
        </div>
    );
}
