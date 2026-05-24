"use client";
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-ui-900 pt-32 pb-40 flex items-center justify-center min-h-[90vh]">
            {/* Premium Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ui-warning rounded-full blur-[150px] opacity-20 animate-pulse-fast"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ui-accent rounded-full blur-[150px] opacity-20 animate-pulse"></div>

            <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-ui-800 mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-ui-warning animate-ping"></span>
                    <span className="text-xs font-semibold text-ui-text tracking-widest uppercase font-mono">Next-Gen Safety Systems</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
                >
                    Fire Detection and <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-ui-warning to-ui-critical drop-shadow-lg">
                        Cooperative Robotic Response
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-ui-muted leading-relaxed"
                >
                    A modular, fullstack platform combining embedded sensors, real-time React analytics, and inter-robot communication to revolutionize autonomous emergency responses.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
                >
                    <a href="#dashboard" className="px-8 py-4 rounded-xl bg-ui-warning text-ui-900 font-bold hover:bg-yellow-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 text-lg">
                        Launch Command Center <ChevronRight className="w-5 h-5" />
                    </a>
                    <a href="#about" className="px-8 py-4 rounded-xl glass-panel text-white font-medium hover:bg-ui-800 transition-colors border border-ui-700 flex items-center justify-center text-lg">
                        View Architecture
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
