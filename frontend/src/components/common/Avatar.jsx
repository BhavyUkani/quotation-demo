const Avatar = ({ name, className = "w-10 h-10 text-sm mr-4" }) => {
    const getInitials = (text) => {
        if (!text) return '?';
        const parts = text.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return text.substring(0, 2).toUpperCase();
    };

    return (
        <div className={`rounded-full flex items-center justify-center font-bold select-none bg-gradient-to-br from-red-100 to-indigo-100 text-red-700 ${className}`}>
            {getInitials(name)}
        </div>
    );
};

export default Avatar;