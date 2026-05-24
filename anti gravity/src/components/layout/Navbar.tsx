"use client";
import { Flame } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-ui-900/80 backdrop-blur-xl border-b border-ui-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Flame className="w-6 h-6 text-ui-warning" />
                        <span className="font-bold text-xl text-white tracking-tight">FireBot<span className="text-ui-warning">Sync</span></span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8 font-mono text-sm tracking-wide">
                            <a href="#about" className="text-ui-muted hover:text-white transition-colors">About</a>
                            <a href="#dashboard" className="text-ui-muted hover:text-white transition-colors">Live Dashboard</a>
                            <a href="#system" className="text-ui-muted hover:text-white transition-colors">Architecture</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
