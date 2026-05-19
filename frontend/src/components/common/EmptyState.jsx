import React from 'react';

const EmptyState = ({
    icon: Icon,
    title = 'No data found',
    description = 'Get started by creating a new item',
    action = null
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            {Icon && <Icon size={48} className="text-slate-300 mb-4" />}
            <p className="text-lg font-semibold text-slate-700">{title}</p>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default EmptyState;
