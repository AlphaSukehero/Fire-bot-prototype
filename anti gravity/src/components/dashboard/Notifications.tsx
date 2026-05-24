import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Flame, CheckCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Notifications({ sim }: { sim: any }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        if (sim.simulationState === 'dispatching') {
            const id = Date.now();
            setAlerts(prev => [...prev, { id, type: 'critical', title: 'CRITICAL ALERT', msg: `Secondary Responder Beta dispatched to ${sim.activeSector.name}!` }]);
            setTimeout(() => setAlerts(p => p.filter(a => a.id !== id)), 6000);
        }
        if (sim.simulationState === 'analyzing') {
            const id = Date.now();
            setAlerts(prev => [...prev, { id, type: 'warning', title: 'WARNING', msg: `Alpha examining anomalous heat in ${sim.activeSector.name}` }]);
            setTimeout(() => setAlerts(p => p.filter(a => a.id !== id)), 5000);
        }
        if (sim.simulationState === 'resolved') {
            const id = Date.now();
            setAlerts(prev => [...prev, { id, type: 'success', title: 'RESOLVED', msg: `Area ${sim.activeSector.name} has been neutralized.` }]);
            setTimeout(() => setAlerts(p => p.filter(a => a.id !== id)), 6000);
        }
    }, [sim.simulationState, sim.activeSector.name]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'critical': return <Flame className="w-5 h-5 text-ui-critical animate-pulse" />;
            case 'warning': return <Bell className="w-5 h-5 text-ui-warning animate-bounce" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-ui-success" />;
            default: return <Info className="w-5 h-5 text-ui-accent" />;
        }
    };

    const getStyle = (type: string) => {
        switch (type) {
            case 'critical': return 'border-ui-critical/50 bg-ui-critical/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
            case 'warning': return 'border-ui-warning/50 bg-ui-warning/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
            case 'success': return 'border-ui-success/50 bg-ui-success/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
            default: return 'border-ui-800 bg-ui-900/80';
        }
    };

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {alerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        className={`glass-panel border rounded-xl p-4 w-80 backdrop-blur-md flex items-start gap-3 pointer-events-auto ${getStyle(alert.type)}`}
                    >
                        <div className="mt-0.5">{getIcon(alert.type)}</div>
                        <div>
                            <h4 className={`font-bold text-sm ${alert.type === 'critical' ? 'text-ui-critical' : alert.type === 'warning' ? 'text-ui-warning' : alert.type === 'success' ? 'text-ui-success' : 'text-ui-text'}`}>{alert.title}</h4>
                            <p className="text-ui-text text-xs mt-1 font-mono leading-relaxed">{alert.msg}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
