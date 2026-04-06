<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>{{ $headline }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Noto+Serif:wdth,wght@75..100,600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f6efe6;font-family:'Manrope',ui-sans-serif,system-ui,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fff8f2;padding:32px 16px 48px;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background-color:#f6efe6;border-radius:16px;padding:8px;">
                    <tr>
                        <td style="background-color:#fcf9f5;border-radius:12px;padding:40px 32px 36px;">
                            <h1 style="margin:0 0 12px;font-family:'Noto Serif',ui-serif,Georgia,serif;font-size:28px;font-weight:600;line-height:1.2;letter-spacing:-0.02em;color:#5C4033;text-align:center;">
                                {{ $headline }}
                            </h1>
                            <p style="margin:0 0 28px;font-size:15px;line-height:1.55;color:#5C4033;opacity:0.88;text-align:center;">
                                {{ $intro }}
                            </p>
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding:0 0 28px;">
                                        <a href="{{ $verificationUrl }}" style="display:inline-block;padding:14px 28px;border-radius:12px;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;color:#fcf9f5;background:linear-gradient(135deg,#9f393b 0%,#bf5152 100%);font-family:'Manrope',ui-sans-serif,system-ui,sans-serif;">
                                            {{ $actionText }}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#5C4033;opacity:0.75;text-align:center;">
                                {{ $linkFallbackLabel }}
                            </p>
                            <p style="margin:0 0 28px;font-size:12px;line-height:1.45;word-break:break-all;text-align:center;">
                                <a href="{{ $verificationUrl }}" style="color:#9f393b;text-decoration:underline;">{{ $verificationUrl }}</a>
                            </p>
                            <p style="margin:0;font-size:14px;line-height:1.55;color:#5C4033;opacity:0.85;text-align:center;">
                                {{ $outro }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 16px 8px;text-align:center;">
                            <p style="margin:0;font-family:'Noto Serif',ui-serif,Georgia,serif;font-size:15px;font-weight:600;color:#5C4033;opacity:0.9;">
                                {{ $appName }}
                            </p>
                            <p style="margin:8px 0 0;font-size:12px;line-height:1.45;color:#5C4033;opacity:0.55;">
                                {{ $footer }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
