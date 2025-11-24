import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@renderer/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'w-full px-3 py-2 rounded-lg border border-dark-300 dark:border-dark-600',
                        'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'transition-all cursor-pointer',
                        error && 'border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
