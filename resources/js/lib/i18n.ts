//* Libraries imports
import { usePage } from '@inertiajs/react';

function getNestedString(
    messages: Record<string, unknown>,
    path: string,
): string | undefined {
    const segments = path.split('.');
    let current: unknown = messages;

    for (const segment of segments) {
        if (current === null || typeof current !== 'object') {
            return undefined;
        }

        current = (current as Record<string, unknown>)[segment];
    }

    return typeof current === 'string' ? current : undefined;
}

function applyReplacements(
    template: string,
    replaces: Record<string, string | number>,
): string {
    let result = template;

    for (const [name, value] of Object.entries(replaces)) {
        const str = String(value);
        result = result.replaceAll(`:${name}`, str);
        result = result.replaceAll(`{${name}}`, str);
    }

    return result;
}

/**
 * Resolve a translation from the shared Inertia `translations` map.
 * Prefer flat keys (e.g. `auth.login.title`). If the key is absent, tries dot-path traversal for nested JSON.
 */
export function translate(
    messages: Record<string, unknown>,
    key: string,
    replaces?: Record<string, string | number>,
): string {
    let raw: unknown;

    if (Object.prototype.hasOwnProperty.call(messages, key)) {
        raw = messages[key];
    } else {
        raw = getNestedString(messages, key);
    }

    if (typeof raw !== 'string') {
        return key;
    }

    if (!replaces || Object.keys(replaces).length === 0) {
        return raw;
    }

    return applyReplacements(raw, replaces);
}

export function useTranslations(): {
    t: (key: string, replaces?: Record<string, string | number>) => string;
    translations: Record<string, unknown>;
} {
    const page = usePage();
    const translations =
        (page.props.translations as Record<string, unknown> | undefined) ?? {};

    function t(
        key: string,
        replaces?: Record<string, string | number>,
    ): string {
        return translate(translations, key, replaces);
    }

    return { t, translations };
}
