export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
            {icon && (
                <div className="mb-6 text-neutral-300 dark:text-neutral-700">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                {title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md leading-relaxed">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-all shadow-sm hover:shadow-md"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
