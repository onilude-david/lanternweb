import React from 'react';
import { cn } from '../../lib/utils';

export default function LanternButton({
    children,
    onClick,
    variant = 'primary', // primary, secondary, ghost
    size = 'md', // sm, md, lg
    className,
    disabled = false,
    ...props
}) {
    const variants = {
        primary: "bg-lantern-red text-white hover:bg-red-600 shadow-lg shadow-red-200 border-b-4 border-red-800 active:border-b-0 active:translate-y-1",
        secondary: "bg-lantern-yellow text-lantern-dark hover:bg-yellow-400 shadow-lg shadow-yellow-200 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1",
        dark: "bg-lantern-dark text-white hover:bg-gray-800 shadow-lg shadow-gray-400/20 border-b-4 border-gray-900 active:border-b-0 active:translate-y-1",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-xl",
        md: "px-5 py-2.5 text-sm rounded-2xl",
        lg: "px-8 py-4 text-lg rounded-3xl"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "font-bold transition-all duration-200 flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                disabled && "opacity-50 cursor-not-allowed active:translate-y-0 active:border-b-4",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
