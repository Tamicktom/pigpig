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

//* Lib imports
import { useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const GROUPS_PUBLIC_DRP_FILTER_ALL_ID = -1;

export type GroupsPublicDrpFilterOption = {
    id: number;
    name: string;
    slug?: string | null;
};

type GroupsPublicDrpFilterSelectProps = {
    inputId: string;
    toggleButtonId: string;
    drpOptions: GroupsPublicDrpFilterOption[];
    selectedDrpId: number | null;
    onSelectDrpId: (drpId: number | null) => void;
};

function drpMatchesQuery(
    drpOption: GroupsPublicDrpFilterOption,
    normalizedQuery: string,
): boolean {
    if (normalizedQuery === '') {
        return true;
    }

    return drpOption.name.toLowerCase().includes(normalizedQuery);
}

/**
 * Public groups index: filter list by DRP using the same Combobox pattern as registration polo pick.
 */
export function GroupsPublicDrpFilterSelect(
    props: GroupsPublicDrpFilterSelectProps,
) {
    const { t } = useTranslations();
    const [query, setQuery] = useState('');

    const normalizedQuery = query.trim().toLowerCase();

    const allOption = useMemo(
        (): GroupsPublicDrpFilterOption => ({
            id: GROUPS_PUBLIC_DRP_FILTER_ALL_ID,
            name: t('groups.public.filter_all'),
            slug: null,
        }),
        [t],
    );

    const selectedOption = useMemo(() => {
        if (props.selectedDrpId === null) {
            return allOption;
        }

        const found = props.drpOptions.find(
            (option) => option.id === props.selectedDrpId,
        );

        return found ?? allOption;
    }, [props.selectedDrpId, props.drpOptions, allOption]);

    const filteredDrpOptions = useMemo(() => {
        return props.drpOptions.filter((drpOption) =>
            drpMatchesQuery(drpOption, normalizedQuery),
        );
    }, [props.drpOptions, normalizedQuery]);

    const displayOptions = useMemo(() => {
        return [allOption, ...filteredDrpOptions];
    }, [allOption, filteredDrpOptions]);

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

                props.onSelectDrpId(
                    nextValue.id === GROUPS_PUBLIC_DRP_FILTER_ALL_ID
                        ? null
                        : nextValue.id,
                );
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
                    displayValue={(option: GroupsPublicDrpFilterOption | null) =>
                        option == null ? '' : option.name
                    }
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
                        {option.name}
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}
