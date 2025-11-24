import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@renderer/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full px-3 py-2 rounded-lg border border-dark-300 dark:border-dark-600',
                        'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100',
                        'placeholder:text-dark-400 dark:placeholder:text-dark-500',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'transition-all resize-vertical',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
