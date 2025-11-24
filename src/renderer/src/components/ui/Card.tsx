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
                    'rounded-xl border border-neutral-200 dark:border-neutral-700',
                    'bg-white dark:bg-neutral-800',
                    'shadow-sm',
                    'transition-all duration-300',
                    hover && 'hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer hover:-translate-y-0.5',
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
