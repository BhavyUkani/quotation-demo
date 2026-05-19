import React from 'react';

const StatusCard = ({ title, count, icon, color }) => {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 relative overflow-hidden flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100">
                    <div className={color ? color.replace('bg-', 'text-') : 'text-slate-600'}>
                        {React.isValidElement(icon) ? React.cloneElement(icon, { size: 24 }) : icon}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{count}</h3>
                </div>
            </div>

            {/* Right border from color prop */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${color}`}></div>
        </div>
    );
};

export default StatusCard;
