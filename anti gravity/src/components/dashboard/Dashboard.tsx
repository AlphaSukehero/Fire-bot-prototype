"use client";
import { useSimulation } from '@/hooks/useSimulation';
import { TacticalMap } from './TacticalMap';
import { Telemetry } from './Telemetry';
import { Controls } from './Controls';
import { Notifications } from './Notifications';
import { ThermalFeed } from './ThermalFeed';
import { TerminalLog } from './TerminalLog';
import { Activity } from 'lucide-react';

export default function Dashboard() {
    const sim = useSimulation();

    return (
        <div className={`min-h-screen transition-colors duration-1000 ${sim.theme === 'night_ops' ? 'bg-[#0a0202] text-red-50' : 'bg-ui-950'}`}>
            <Notifications sim={sim} />
            <section id="dashboard" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Activity className="w-8 h-8 text-ui-accent" /> Live Command Center
                        </h2>
                        <div className="h-1 w-20 bg-ui-accent mt-4 rounded-full"></div>
                    </div>

                    <Controls sim={sim} />
                    <Telemetry sim={sim} />
                    <TacticalMap sim={sim} />

                    <ThermalFeed sim={sim} />

                    <TerminalLog sim={sim} />
                </div>
            </section>
        </div>
    );
}
