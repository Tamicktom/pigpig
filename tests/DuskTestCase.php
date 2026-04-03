<?php

namespace Tests;

// * Libraries imports
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Collection;
use Laravel\Dusk\TestCase as BaseTestCase;
use PHPUnit\Framework\Attributes\BeforeClass;
use Symfony\Component\Process\ExecutableFinder;

abstract class DuskTestCase extends BaseTestCase
{
    use DatabaseMigrations;

    /**
     * Map localhost to 127.0.0.1 so Chromium does not prefer IPv6 (::1) when the PHP server
     * is only listening on IPv4.
     */
    protected function baseUrl(): string
    {
        $url = rtrim(parent::baseUrl(), '/');
        $parts = parse_url($url);
        if (! is_array($parts) || ! isset($parts['host'])) {
            return $url;
        }

        if (strcasecmp($parts['host'], 'localhost') !== 0) {
            return $url;
        }

        $scheme = $parts['scheme'] ?? 'http';
        $port = isset($parts['port']) ? ':'.$parts['port'] : '';

        return $scheme.'://127.0.0.1'.$port;
    }

    /**
     * Prepare for Dusk test execution.
     */
    #[BeforeClass]
    public static function prepare(): void
    {
        if (static::runningInSail()) {
            return;
        }

        $chromedriver = static::resolveChromedriverPath();
        if ($chromedriver !== null) {
            static::useChromedriver($chromedriver);
        }

        static::startChromeDriver(['--port=9515']);
    }

    /**
     * Create the RemoteWebDriver instance.
     */
    protected function driver(): RemoteWebDriver
    {
        $arguments = collect([
            $this->shouldStartMaximized() ? '--start-maximized' : '--window-size=1920,1080',
            '--disable-search-engine-choice-screen',
            '--disable-smooth-scrolling',
        ]);

        if (function_exists('posix_geteuid') && posix_geteuid() === 0) {
            $arguments->push('--no-sandbox', '--disable-dev-shm-usage');
        }

        $arguments = $arguments->unless($this->hasHeadlessDisabled(), function (Collection $items) {
            return $items->merge([
                '--disable-gpu',
                '--headless=new',
            ]);
        });

        $options = (new ChromeOptions)->addArguments($arguments->all());

        $chromeBinary = $this->resolveChromeBinary();
        if ($chromeBinary !== null) {
            $options->setBinary($chromeBinary);
        }

        return RemoteWebDriver::create(
            $_ENV['DUSK_DRIVER_URL'] ?? env('DUSK_DRIVER_URL') ?? 'http://localhost:9515',
            DesiredCapabilities::chrome()->setCapability(
                ChromeOptions::CAPABILITY, $options
            )
        );
    }

    /**
     * Prefer an explicit path, then common install locations, then PATH (e.g. CI).
     */
    protected static function resolveChromedriverPath(): ?string
    {
        $fromEnv = $_ENV['DUSK_CHROMEDRIVER_PATH'] ?? getenv('DUSK_CHROMEDRIVER_PATH');
        if (is_string($fromEnv) && $fromEnv !== '' && is_file($fromEnv)) {
            return $fromEnv;
        }

        foreach (['/usr/bin/chromedriver', '/usr/local/bin/chromedriver'] as $path) {
            if (is_file($path)) {
                return $path;
            }
        }

        $found = (new ExecutableFinder)->find('chromedriver');
        if ($found !== null && is_file($found)) {
            return $found;
        }

        return null;
    }

    /**
     * Use system Chromium/Chrome when present (e.g. Docker app image).
     */
    protected function resolveChromeBinary(): ?string
    {
        $fromEnv = $_ENV['DUSK_CHROME_BINARY'] ?? getenv('DUSK_CHROME_BINARY');
        if (is_string($fromEnv) && $fromEnv !== '' && is_file($fromEnv)) {
            return $fromEnv;
        }

        foreach (['/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'] as $path) {
            if (is_file($path)) {
                return $path;
            }
        }

        return null;
    }
}
