import React from 'react';
import { cn } from '../../lib/utils';
import { Star } from 'lucide-react';

export default function GamifiedProgress({ value, max = 100, className }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={cn("w-full", className)}>
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</span>
                <span className="text-sm font-bold text-lantern-dark">{Math.round(percentage)}%</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px]" />

                {/* Progress Bar */}
                <div
                    className="h-full bg-gradient-to-r from-lantern-yellow to-yellow-400 transition-all duration-1000 ease-out relative"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shine Effect */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50" />

                    {/* Star Indicator at the end */}
                    {percentage > 5 && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-0.5 shadow-sm">
                            <Star className="w-2 h-2 text-lantern-yellow fill-current" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
