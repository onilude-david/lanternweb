import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leisureData, categories } from '../data/leisureData';
import { cn } from '../lib/utils';
import { Search, BookOpen } from 'lucide-react';
import KidCard from './ui/KidCard';
import GamifiedProgress from './ui/GamifiedProgress';

export default function LibraryDashboard() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = leisureData.filter(book => {
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">The Library</h1>
                    <p className="text-gray-500 mt-2">Explore magical worlds and amazing adventures.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-lantern-yellow/50 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border",
                            selectedCategory === category
                                ? "bg-lantern-yellow text-lantern-dark border-lantern-yellow"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredBooks.map((book) => (
                    <div
                        key={book.id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/book/${book.id}`)}
                    >
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 mb-3">
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {book.progress > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${book.progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-gray-900 leading-tight group-hover:text-lantern-red transition-colors">{book.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{book.category}</p>
                    </div>
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No books found</h3>
                    <p className="text-gray-500">Try adjusting your search or category.</p>
                </div>
            )}
        </div>
    );
}
