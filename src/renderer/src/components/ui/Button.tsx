import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@renderer/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
            secondary: 'bg-dark-200 text-dark-900 hover:bg-dark-300 focus:ring-dark-400 dark:bg-dark-700 dark:text-dark-100 dark:hover:bg-dark-600',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
            ghost: 'bg-transparent hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-700 dark:text-dark-300',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
