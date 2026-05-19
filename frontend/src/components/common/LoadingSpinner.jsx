import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: 'h-8 w-8 border-2',
        md: 'h-12 w-12 border-b-2',
        lg: 'h-16 w-16 border-b-4',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`animate-spin rounded-full ${sizes[size]} border-red-600`}></div>
            {text && <p className="mt-4 text-slate-600 font-medium">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
