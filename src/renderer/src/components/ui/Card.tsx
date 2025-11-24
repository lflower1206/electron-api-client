import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@renderer/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-lg border border-dark-200 dark:border-dark-700',
                    'bg-white dark:bg-dark-800',
                    'shadow-sm',
                    'transition-all',
                    hover && 'hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
