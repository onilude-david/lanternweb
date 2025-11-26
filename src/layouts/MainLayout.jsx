import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { cn } from '../lib/utils';
import { Menu } from 'lucide-react';

export default function MainLayout() {
    const { mode } = useApp();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-lg text-gray-900">Lantern Hub</span>
                    </div>
                    <div className="w-8 h-8 bg-lantern-red rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
                </div>

                <main className={cn(
                    "flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth",
                    mode === 'academic' ? "font-sans" : "font-display"
                )}>
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
