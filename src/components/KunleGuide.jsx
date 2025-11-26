import React from 'react';
import { cn } from '../lib/utils';

export default function KunleGuide({ message, className }) {
    return (
        <div className={cn("flex items-end space-x-3", className)}>
            {/* Kunle Avatar */}
            <div className="relative w-16 h-16 flex-shrink-0">
                <div className="absolute inset-0 bg-lantern-yellow rounded-full shadow-lg border-2 border-white overflow-hidden">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kunle&backgroundColor=FFD700"
                        alt="Kunle"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Badge */}
                <div className="absolute -bottom-1 -right-1 bg-lantern-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                    GUIDE
                </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 max-w-xs relative animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {message || "Welcome back, Scholar! Ready to climb some steps today?"}
                </p>
            </div>
        </div>
    );
}
