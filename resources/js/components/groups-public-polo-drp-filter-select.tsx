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
import type { PoloDrpOption } from '@/components/drp-by-polo-select';
import { poloMatchesQuery } from '@/components/drp-by-polo-select';

//* Lib imports
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const GROUPS_PUBLIC_POLO_FILTER_ALL_ID = -1;

type GroupsPublicPoloDrpFilterOption =
    | PoloDrpOption
    | {
          id: typeof GROUPS_PUBLIC_POLO_FILTER_ALL_ID;
          name: string;
          drp_id: 0;
          drp_name: '';
      };

type GroupsPublicPoloDrpFilterSelectProps = {
    inputId: string;
    toggleButtonId: string;
    poloOptions: PoloDrpOption[];
    selectedDrpId: number | null;
    selectedPoloId: number | null;
    onSelectPoloFilter: (
        selection: { drp_id: number; polo_id: number } | null,
    ) => void;
};

/**
 * Public groups index: filter list by DRP via polo pick (same row shape as registration).
 */
export function GroupsPublicPoloDrpFilterSelect(
    props: GroupsPublicPoloDrpFilterSelectProps,
) {
    const { t } = useTranslations();
    const [query, setQuery] = useState('');

    const normalizedQuery = query.trim().toLowerCase();

    const allOption = useMemo(
        (): GroupsPublicPoloDrpFilterOption => ({
            id: GROUPS_PUBLIC_POLO_FILTER_ALL_ID,
            name: t('groups.public.filter_all'),
            drp_id: 0,
            drp_name: '',
        }),
        [t],
    );

    const selectedOption = useMemo((): GroupsPublicPoloDrpFilterOption => {
        if (props.selectedPoloId !== null) {
            const byPolo = props.poloOptions.find(
                (polo) => polo.id === props.selectedPoloId,
            );

            if (byPolo !== undefined) {
                return byPolo;
            }
        }

        if (props.selectedDrpId === null) {
            return allOption;
        }

        const byDrp = props.poloOptions.find(
            (polo) => polo.drp_id === props.selectedDrpId,
        );

        return byDrp ?? allOption;
    }, [
        props.selectedDrpId,
        props.selectedPoloId,
        props.poloOptions,
        allOption,
    ]);

    const filteredPoloOptions = useMemo(() => {
        return props.poloOptions.filter((poloOption) =>
            poloMatchesQuery(poloOption, normalizedQuery),
        );
    }, [props.poloOptions, normalizedQuery]);

    const displayOptions = useMemo(() => {
        return [allOption, ...filteredPoloOptions];
    }, [allOption, filteredPoloOptions]);

    const fieldClassName = cn(
        'flex h-10 w-full min-w-0 items-stretch overflow-hidden rounded-lg bg-surface-container-highest outline-none transition-[box-shadow] duration-200 ease-out',
        'focus-within:ring-[3px] focus-within:ring-secondary/80 focus-within:ring-offset-0',
    );

    const inputClassName = cn(
        'selection:bg-primary selection:text-primary-foreground flex min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-on-surface shadow-none outline-none',
        'placeholder:text-on-surface-variant',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    );

    const toggleButtonClassName = cn(
        'text-on-surface-variant flex shrink-0 items-center justify-center border-l border-on-surface/10 bg-transparent px-3 outline-none',
        'transition-[color,background-color] duration-200 ease',
        'disabled:pointer-events-none disabled:opacity-50',
        '[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-container-high/80 active:bg-surface-container-high/80',
    );

    return (
        <Combobox
            by="id"
            value={selectedOption}
            onChange={(nextValue) => {
                if (nextValue == null) {
                    return;
                }

                if (nextValue.id === GROUPS_PUBLIC_POLO_FILTER_ALL_ID) {
                    props.onSelectPoloFilter(null);

                    return;
                }

                props.onSelectPoloFilter({
                    drp_id: nextValue.drp_id,
                    polo_id: nextValue.id,
                });
            }}
            onClose={() => {
                setQuery('');
            }}
        >
            <div className={fieldClassName}>
                <ComboboxInput
                    id={props.inputId}
                    autoComplete="off"
                    aria-label={t('groups.public.filter_aria')}
                    className={inputClassName}
                    displayValue={(
                        option: GroupsPublicPoloDrpFilterOption | null,
                    ) => {
                        if (option == null) {
                            return '';
                        }

                        if (option.id === GROUPS_PUBLIC_POLO_FILTER_ALL_ID) {
                            return option.name;
                        }

                        return `${option.name} — ${option.drp_name}`;
                    }}
                    placeholder={t('groups.public.filter_search_placeholder')}
                    onChange={(event) => {
                        setQuery(event.target.value);
                    }}
                />
                <ComboboxButton
                    id={props.toggleButtonId}
                    type="button"
                    aria-label={t('groups.public.filter_open_list')}
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
                    '[--anchor-gap:--spacing(1)] z-50 max-h-60 w-(--input-width) overflow-auto rounded-lg border border-on-surface/10 bg-surface-container-highest p-1 text-on-surface shadow-md',
                    'transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 motion-reduce:transition-none motion-reduce:data-closed:scale-100',
                )}
            >
                {displayOptions.map((option) => (
                    <ComboboxOption
                        key={option.id}
                        value={option}
                        className={cn(
                            'cursor-default rounded-md py-2 pr-8 pl-2 text-sm select-none',
                            'data-focus:bg-surface-container-high data-focus:text-on-surface',
                            'data-selected:font-medium',
                        )}
                    >
                        {option.id === GROUPS_PUBLIC_POLO_FILTER_ALL_ID
                            ? option.name
                            : `${option.name} — ${option.drp_name}`}
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}
