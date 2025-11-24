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
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700',
                        'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
                        'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                        'focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700 focus:border-transparent',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
                        'transition-all duration-200 resize-vertical',
                        error && 'border-red-300 focus:ring-red-200',
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
