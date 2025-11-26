import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export default function ModeToggle() {
    const { mode, toggleMode } = useApp();

    return (
        <div
            className="relative flex items-center bg-gray-200 rounded-full p-1 cursor-pointer w-64 h-12"
            onClick={toggleMode}
        >
            <motion.div
                className={cn(
                    "absolute w-1/2 h-10 rounded-full shadow-md z-10",
                    mode === 'academic' ? "bg-lantern-red" : "bg-lantern-yellow"
                )}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                initial={false}
                animate={{ x: mode === 'academic' ? 0 : "100%" }}
            />

            <div className={cn(
                "flex-1 flex items-center justify-center z-20 transition-colors duration-300",
                mode === 'academic' ? "text-white" : "text-gray-500"
            )}>
                <GraduationCap size={20} className="mr-2" />
                <span className="font-semibold text-sm">My Class</span>
            </div>

            <div className={cn(
                "flex-1 flex items-center justify-center z-20 transition-colors duration-300",
                mode === 'leisure' ? "text-lantern-dark" : "text-gray-500"
            )}>
                <BookOpen size={20} className="mr-2" />
                <span className="font-semibold text-sm">The Library</span>
            </div>
        </div>
    );
}
