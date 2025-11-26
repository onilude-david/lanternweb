import React from 'react';
import { cn } from '../../lib/utils';

export default function KidCard({
    title,
    subtitle,
    image,
    onClick,
    className,
    children,
    variant = 'default' // default, locked, active
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-3xl transition-all duration-300 ease-out",
                "bg-white border-2",
                variant === 'locked' ? "border-gray-200 opacity-80 grayscale-[0.5]" :
                    variant === 'active' ? "border-lantern-yellow shadow-xl scale-[1.02] ring-4 ring-lantern-yellow/20" :
                        "border-gray-100 hover:border-lantern-yellow hover:shadow-lg hover:-translate-y-1",
                onClick && "cursor-pointer",
                className
            )}
        >
            {/* Image Area */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                <img
                    src={image}
                    alt={title}
                    className={cn(
                        "h-full w-full object-cover transition-transform duration-500",
                        variant !== 'locked' && "group-hover:scale-110"
                    )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    {subtitle && (
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-lantern-yellow">
                            {subtitle}
                        </div>
                    )}
                    <h3 className="font-display text-xl font-bold leading-tight drop-shadow-md">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Optional Body Content */}
            {children && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );
}
