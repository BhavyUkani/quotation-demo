import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, X, Loader, Loader2 } from 'lucide-react';

const MessageBox = ({
    type = 'info',
    title,
    message,
    isOpen = false,
    onOk,
    onCancel,
    okButtonName = 'Confirm',
    cancelButtonName = 'Cancel',
    hideCancel = false,
    isLoading = false
}) => {
    if (!isOpen) return null;

    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircle className="w-12 h-12 text-teal-500" />,
                    bgIcon: 'bg-teal-50',
                    buttonColor: 'bg-teal-600 hover:bg-teal-700',
                    defaultTitle: 'Success'
                };
            case 'warning':
                return {
                    icon: <AlertTriangle className="w-12 h-12 text-amber-500" />,
                    bgIcon: 'bg-amber-50',
                    buttonColor: 'bg-amber-600 hover:bg-amber-700',
                    defaultTitle: 'Warning'
                };
            case 'error':
                return {
                    icon: <XCircle className="w-12 h-12 text-rose-500" />,
                    bgIcon: 'bg-rose-50',
                    buttonColor: 'bg-rose-600 hover:bg-rose-700',
                    defaultTitle: 'Error'
                };
            case 'loading':
                return {
                    icon: <Loader className="w-12 h-12 text-blue-500 animate-spin" />,
                    bgIcon: 'bg-blue-50',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700',
                    defaultTitle: 'Loading'
                };
            case 'info':
            default:
                return {
                    icon: <Info className="w-12 h-12 text-red-500" />,
                    bgIcon: 'bg-red-50',
                    buttonColor: 'bg-red-600 hover:bg-red-700',
                    defaultTitle: 'Information'
                };
        }
    };

    const config = getConfig();

    return (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={type === 'loading' ? undefined : onCancel}
            ></div>

            {/* Modal */}
            <style>
                {`
                    @keyframes popup {
                        0% { transform: scale(0.95); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-popup {
                        animation: popup 0.2s ease-out forwards;
                    }
                `}
            </style>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-popup">
                {/* Close button */}
                {/* {type !== 'loading' && (
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                )} */}

                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className={`mb-4 p-3 rounded-full ${config.bgIcon}`}>
                            {config.icon}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {title || config.defaultTitle}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Actions */}
                        {type !== 'loading' && (
                            <div className="flex gap-3 w-full">
                                {!hideCancel && (
                                    <button
                                        onClick={onCancel}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {cancelButtonName}
                                    </button>
                                )}
                                <button
                                    onClick={onOk}
                                    disabled={isLoading}
                                    className={`flex-1 px-4 py-2.5 rounded-lg text-white font-bold shadow-lg shadow-red-500/10 transition-all transform hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.buttonColor} disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center`}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {okButtonName}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;