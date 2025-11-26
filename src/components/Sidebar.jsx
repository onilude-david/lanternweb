import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, BookOpen, GraduationCap, Settings, User, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar({ isOpen, onClose }) {
    const { mode, setMode } = useApp();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <div className={cn(
                "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white text-gray-600 flex flex-col border-r border-gray-200 transition-transform duration-300 transform lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-900">
                        <div className="w-8 h-8 bg-lantern-red rounded-lg flex items-center justify-center text-white font-bold">L</div>
                        <span className="font-bold text-lg tracking-tight">Lantern Hub</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded-md">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 mt-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</div>

                    <NavLink
                        to="/"
                        onClick={() => window.innerWidth < 1024 && onClose()}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium",
                            isActive
                                ? "bg-lantern-red/10 text-lantern-red"
                                : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Overview</span>
                    </NavLink>

                    <div className="pt-6 pb-2">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Learning Modes</div>
                        <button
                            onClick={() => {
                                setMode('academic');
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left font-medium mb-1",
                                mode === 'academic'
                                    ? "bg-gray-100 text-gray-900"
                                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                            )}
                        >
                            <GraduationCap className={cn("w-5 h-5", mode === 'academic' ? "text-lantern-red" : "text-gray-400")} />
                            <span>My Class</span>
                        </button>

                        <button
                            onClick={() => {
                                setMode('leisure');
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left font-medium",
                                mode === 'leisure'
                                    ? "bg-gray-100 text-gray-900"
                                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                            )}
                        >
                            <BookOpen className={cn("w-5 h-5", mode === 'leisure' ? "text-lantern-yellow" : "text-gray-400")} />
                            <span>The Library</span>
                        </button>
                    </div>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Student</p>
                            <p className="text-xs text-gray-500 truncate">student@lantern.com</p>
                        </div>
                        <Settings className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>
        </>
    );
}
