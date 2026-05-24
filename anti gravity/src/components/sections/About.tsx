"use client";
import { motion } from 'framer-motion';
import { ShieldAlert, Target, Flame, Activity, Server, Bot, Radio, CheckCircle2 } from 'lucide-react';

const objectives = [
    { icon: Flame, text: "Design sensor-based fire detection robots" },
    { icon: Activity, text: "Analyze fire intensity and spread" },
    { icon: Server, text: "Develop real-time Next.js web dashboards" },
    { icon: Radio, text: "Establish inter-robot mesh communication" },
    { icon: Bot, text: "Enable secondary automatic responders" },
    { icon: CheckCircle2, text: "Database persistence and analytics" }
];

export default function About() {
    return (
        <section id="about" className="py-24 bg-ui-900 border-t border-ui-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-2">The Problem & The Paradigm</h2>
                            <div className="h-1 w-20 bg-ui-warning mt-4 rounded-full"></div>
                        </div>
                        <div className="space-y-6 text-ui-muted">
                            <div className="glass-panel p-8 rounded-2xl border border-ui-800 hover:border-ui-critical/50 transition-colors shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <ShieldAlert className="w-6 h-6 text-ui-critical" /> Traditional Limitations
                                </h3>
                                <p className="leading-relaxed text-sm">
                                    Legacy systems provide boolean alerts. They lack analytical depth and cannot autonomously dispatch robotic responders. This delay costs critical response time.
                                </p>
                            </div>
                            <div className="glass-panel p-8 rounded-2xl border border-ui-800 hover:border-ui-accent/50 transition-colors shadow-lg">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Target className="w-6 h-6 text-ui-accent" /> The Modern Solution
                                </h3>
                                <p className="leading-relaxed text-sm">
                                    We integrate Next.js APIs, SQLite data storage, and embedded robotics (ESP32) into a unified Command Center capable of deploying response units in milliseconds.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-2">Project Objectives</h2>
                            <div className="h-1 w-20 bg-ui-accent mt-4 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {objectives.map((obj, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 glass-panel rounded-xl border border-ui-800 hover:bg-ui-800 transition-colors group">
                                    <div className="mt-1 bg-ui-900 p-2 rounded-lg border border-ui-700 text-ui-accent group-hover:scale-110 transition-transform">
                                        <obj.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-ui-text text-sm font-medium">{obj.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
