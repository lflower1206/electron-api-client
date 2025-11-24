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
                <div className="mb-4 text-dark-400 dark:text-dark-600">
                    {icon}
                </div>
            )}
            <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-2">
                {title}
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6 max-w-md">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
