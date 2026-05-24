import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TerminalLog({ sim }: { sim: any }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [sim.history, sim.simulationState]);

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-8">
            <h3 className="text-ui-muted text-sm font-bold uppercase mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Raw System Telemetry
            </h3>
            <div ref={containerRef} className={`glass-panel rounded-xl border overflow-hidden h-48 flex flex-col p-4 bg-black/80 font-mono text-xs overflow-y-auto ${sim.theme === 'night_ops' ? 'border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-ui-800'}`}>
                <div className="text-ui-muted mb-2">
                    <span className="text-ui-700" suppressHydrationWarning>[{new Date().toLocaleTimeString()}]</span> System Initialized. SECURE_COMM_LINK_ESTABLISHED.
                </div>
                {sim.history.map((val: number, ind: number) => {
                    if (val > 0 || ind === sim.history.length - 1) {
                        const timeStr = new Date(Date.now() - (sim.history.length - 1 - ind) * 1000).toLocaleTimeString();
                        return (
                            <div key={ind} className={`${val > 60 ? 'text-ui-critical' : val > 20 ? 'text-ui-warning' : 'text-ui-accent'} mt-1 opacity-90`}>
                                <span className="text-ui-700" suppressHydrationWarning>[{timeStr}]</span> [SYS_EVT] {val > 0 ? `Sensor read intensity: ${val}% in ${sim.activeSector.name}.` : 'Routine patrol scan. Environment stable.'}
                            </div>
                        );
                    }
                    return null;
                })}
                {sim.simulationState !== 'idle' && (
                    <div className="text-white mt-1">
                        <span className="text-ui-700" suppressHydrationWarning>[{new Date().toLocaleTimeString()}]</span> [COMMAND] Protocol Transition: {sim.simulationState.toUpperCase()}
                    </div>
                )}
                <div className="h-2" />
            </div>
        </motion.div>
    );
}
