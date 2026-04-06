<?php

namespace Database\Seeders\Support;

use RuntimeException;

/**
 * Reads UNIVESP polo ↔ DRP mappings shipped with the app for seeding (dev and production).
 */
final class PolosDrpCsvReader
{
    private const RELATIVE_PATH = 'seeders/polos_drp.csv';

    public static function absolutePath(): string
    {
        return database_path(self::RELATIVE_PATH);
    }

    /**
     * @return list<array{polo: string, drp_code: string}>
     */
    public static function rows(): array
    {
        $path = self::absolutePath();

        if (! is_readable($path)) {
            throw new RuntimeException("Polos CSV is not readable at [{$path}]. Deploy the file with the application or run seeds from the project root.");
        }

        $handle = fopen($path, 'r');

        if ($handle === false) {
            throw new RuntimeException("Unable to open polos CSV at [{$path}].");
        }

        try {
            $header = fgetcsv($handle);

            if ($header === false || $header === [null] || $header === []) {
                throw new RuntimeException("Polos CSV at [{$path}] has no header row.");
            }

            $header[0] = self::stripBom((string) ($header[0] ?? ''));

            $expected = ['Polo', 'DRP'];
            if (array_map('trim', $header) !== $expected) {
                throw new RuntimeException('Polos CSV header must be "Polo,DRP".');
            }

            $rows = [];

            while (($record = fgetcsv($handle)) !== false) {
                if ($record === [null] || $record === []) {
                    continue;
                }

                $polo = trim((string) ($record[0] ?? ''));
                $drpCode = trim((string) ($record[1] ?? ''));

                if ($polo === '' || $drpCode === '') {
                    continue;
                }

                $rows[] = ['polo' => $polo, 'drp_code' => $drpCode];
            }

            return $rows;
        } finally {
            fclose($handle);
        }
    }

    /**
     * Distinct DRP codes from the CSV, sorted naturally (DRP01 … DRP14).
     *
     * @return list<string>
     */
    public static function uniqueDrpCodes(): array
    {
        $seen = [];

        foreach (self::rows() as $row) {
            $seen[$row['drp_code']] = true;
        }

        $codes = array_keys($seen);
        sort($codes, SORT_NATURAL);

        return $codes;
    }

    private static function stripBom(string $value): string
    {
        if (str_starts_with($value, "\xEF\xBB\xBF")) {
            return substr($value, 3);
        }

        return $value;
    }
}
