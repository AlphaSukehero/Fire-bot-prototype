"use client";
import { Cpu, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SystemDetails() {
    return (
        <section id="system" className="py-24 bg-ui-900 border-t border-ui-800 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <Cpu className="w-8 h-8 text-ui-accent" /> Hardware Components
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {['Microcontroller (ESP32)', 'Flame Sensor IR Module', 'Motor Driver (L298N)', 'Chassis & DC Motors', 'Wireless RF Mesh', 'Li-Po Power Supply'].map((comp, i) => (
                                <div key={i} className="glass-panel border border-ui-800 p-4 rounded-xl flex items-center gap-3 hover:border-ui-accent/30 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-ui-accent shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                                    <span className="text-ui-text text-sm font-medium font-mono">{comp}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-ui-success" /> System Advantages
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    'Fullstack real-time analytics with Next.js API logging',
                                    'Cooperative multi-robot dispatch (Alpha -> Beta)',
                                    'Scalable mesh-network sensor nodes',
                                    'Permanent incident logging via embedded SQLite DB natively managed'
                                ].map((adv, i) => (
                                    <li key={i} className="flex items-start gap-4 text-ui-muted glass-panel p-4 rounded-xl border border-ui-800">
                                        <ChevronRight className="w-5 h-5 text-ui-success shrink-0" />
                                        <span className="text-sm leading-relaxed">{adv}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
