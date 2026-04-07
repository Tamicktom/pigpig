//* Libraries imports
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

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

export function poloMatchesQuery(
    poloOption: PoloDrpOption,
    normalizedQuery: string,
): boolean {
    if (normalizedQuery === '') {
        return true;
    }

    const haystack = `${poloOption.name} ${poloOption.drp_name}`.toLowerCase();

    return haystack.includes(normalizedQuery);
}

/**
 * Registration control: user picks their polo by name; the form submits `drp_id`.
 */
export function DrpByPoloSelect(props: DrpByPoloSelectProps) {
    const { t } = useTranslations();
    const [selectedPolo, setSelectedPolo] = useState<PoloDrpOption | null>(null);
    const [query, setQuery] = useState('');

    const normalizedQuery = query.trim().toLowerCase();

    const filteredPoloOptions = useMemo(() => {
        return props.poloOptions.filter((poloOption) =>
            poloMatchesQuery(poloOption, normalizedQuery),
        );
    }, [props.poloOptions, normalizedQuery]);

    const hiddenDrpIdValue = selectedPolo === null ? '' : String(selectedPolo.drp_id);

    const fieldClassName = cn(
        'border-input dark:bg-input/30 flex w-full min-w-0 items-stretch overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        props.errorMessage !== undefined &&
            props.errorMessage !== '' &&
            'border-destructive ring-destructive/20 ring-[3px] dark:ring-destructive/40',
        props.selectClassName,
    );

    const inputClassName = cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 min-w-0 flex-1 border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none md:text-sm',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        props.errorMessage !== undefined &&
            props.errorMessage !== '' &&
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    );

    const toggleButtonClassName = cn(
        'border-input text-muted-foreground flex shrink-0 items-center justify-center border-l bg-transparent px-3 outline-none',
        'transition-[color,background-color] duration-200 ease',
        'disabled:pointer-events-none disabled:opacity-50',
        '[@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent/50 active:bg-accent/50',
    );

    return (
        <div className="grid gap-2">
            <Label htmlFor="drp_id">{t('auth.register.polo_label')}</Label>
            <input type="hidden" name="drp_id" value={hiddenDrpIdValue} />
            <Combobox
                by="id"
                value={selectedPolo}
                invalid={
                    props.errorMessage !== undefined && props.errorMessage !== ''
                }
                onChange={(nextValue) => {
                    setSelectedPolo(nextValue);
                }}
                onClose={() => {
                    setQuery('');
                }}
            >
                <div className={fieldClassName}>
                    <ComboboxInput
                        id="drp_id"
                        autoComplete="off"
                        aria-invalid={props.errorMessage ? true : undefined}
                        className={inputClassName}
                        displayValue={(
                            polo: PoloDrpOption | null | undefined,
                        ) =>
                            polo == null
                                ? ''
                                : `${polo.name} — ${polo.drp_name}`
                        }
                        placeholder={t('auth.register.polo_search_placeholder')}
                        tabIndex={props.tabIndex}
                        onChange={(event) => {
                            setQuery(event.target.value);
                        }}
                    />
                    <ComboboxButton
                        id="drp_id_toggle"
                        type="button"
                        aria-label={t('auth.register.polo_open_list')}
                        className={toggleButtonClassName}
                    >
                        <ChevronDownIcon
                            aria-hidden
                            className="size-4 opacity-50"
                        />
                    </ComboboxButton>
                </div>
                <ComboboxOptions
                    anchor="bottom start"
                    transition
                    className={cn(
                        'bg-popover text-popover-foreground [--anchor-gap:--spacing(1)] z-50 max-h-60 w-(--input-width) overflow-auto rounded-md border p-1 shadow-md',
                        'transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 motion-reduce:transition-none motion-reduce:data-closed:scale-100',
                    )}
                >
                    {filteredPoloOptions.length === 0 ? (
                        <div className="text-muted-foreground px-2 py-2 text-sm">
                            {t('auth.register.polo_no_results')}
                        </div>
                    ) : (
                        filteredPoloOptions.map((poloOption) => (
                            <ComboboxOption
                                key={poloOption.id}
                                value={poloOption}
                                className={cn(
                                    'data-focus:bg-accent data-focus:text-accent-foreground cursor-default rounded-sm py-1.5 pr-8 pl-2 text-sm select-none',
                                    'data-selected:font-medium',
                                )}
                            >
                                {poloOption.name} — {poloOption.drp_name}
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </Combobox>
            <InputError message={props.errorMessage} />
        </div>
    );
}
