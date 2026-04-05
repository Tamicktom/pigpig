import type { ImgHTMLAttributes } from 'react';

//* Lib imports
import { cn } from '@/lib/utils';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { className, alt = '', decoding = 'async', ...rest } = props;

    return (
        <img
            {...rest}
            src="/favicon.svg"
            alt={alt}
            decoding={decoding}
            className={cn('object-contain', className)}
        />
    );
}
