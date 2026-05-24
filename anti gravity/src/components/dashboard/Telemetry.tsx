import { Thermometer, Wind, BarChart3, Wifi, Battery, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Telemetry({ sim }: { sim: any }) {
    const { intensity, history, activeSector, simulationState, battery, payload, wind, temperature, theme } = sim;

    const getIntensityColor = () => {
        if (intensity < 30) return 'text-ui-success';
        if (intensity < 60) return 'text-ui-warning';
        return 'text-ui-critical';
    };

    const isNight = theme === 'night_ops';
    const cardClass = `glass-panel rounded-xl p-6 border shadow-xl ${isNight ? 'border-red-900/50 bg-[#120404] shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'border-ui-800'}`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className={cardClass}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className={`font-bold ${isNight ? 'text-red-50' : 'text-white'}`}>Primary Robot</h4>
                        <span className="text-xs text-ui-accent font-mono">Scout Unit Alpha</span>
                    </div>
                    <span className="flex h-3 w-3 rounded-full bg-ui-success shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm bg-ui-900/50 p-2.5 rounded-lg border border-ui-800">
                        <span className="text-ui-muted">Status:</span>
                        <span className="text-white font-medium">{simulationState.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-ui-900/50 p-2.5 rounded-lg border border-ui-800">
                        <span className="text-ui-muted flex items-center gap-1"><Battery className="w-4 h-4" /> Battery:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-ui-800 rounded-full overflow-hidden">
                                <div className={`h-full ${battery > 20 ? 'bg-ui-success' : 'bg-ui-critical'}`} style={{ width: `${battery}%` }}></div>
                            </div>
                            <span className="text-white font-mono text-xs">{battery.toFixed(0)}%</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-ui-900/50 p-2.5 rounded-lg border border-ui-800">
                        <span className="text-ui-muted flex items-center gap-1"><Droplets className="w-4 h-4 text-ui-accent" /> Payload:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-ui-800 rounded-full overflow-hidden">
                                <div className="h-full bg-ui-accent transition-all duration-300" style={{ width: `${payload}%` }}></div>
                            </div>
                            <span className="text-white font-mono text-xs">{payload.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`${cardClass} flex flex-col justify-center items-center relative overflow-hidden`}>
                <div className="flex justify-between w-full mb-4 px-2">
                    <div className="text-center">
                        <span className="text-[10px] text-ui-muted uppercase font-bold flex items-center gap-1"><Thermometer className="w-3 h-3 text-ui-critical" /> Temp</span>
                        <span className="text-sm font-mono text-white">{temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] text-ui-muted uppercase font-bold flex items-center gap-1"><Wind className="w-3 h-3 text-ui-muted" /> Wind</span>
                        <span className="text-sm font-mono text-white">{wind.speed}km/h {wind.direction}</span>
                    </div>
                </div>

                <h4 className="text-ui-muted text-sm font-bold mb-1 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Threat Level
                </h4>
                <div className={`text-6xl font-bold mb-1 font-mono tracking-tighter ${getIntensityColor()}`}>
                    {intensity}<span className="text-3xl text-ui-700">%</span>
                </div>
                <p className={`text-xs font-medium text-center h-4 ${isNight ? 'text-ui-muted' : 'text-ui-text'}`}>
                    {intensity < 20 ? 'Environment Secure' : intensity < 60 ? `Warning in ${activeSector.name}` : `CRITICAL in ${activeSector.name}`}
                </p>

                <div className="w-full mt-4">
                    <div className="flex items-end gap-[2px] h-12 w-full">
                        {history.map((val: number, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(5, val)}%` }}
                                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                                className={`flex-1 rounded-t-[2px] ${val >= 60 ? 'bg-ui-critical' : val >= 30 ? 'bg-ui-warning' : 'bg-ui-accent'}`}
                                style={{ opacity: 0.2 + (i / 20) * 0.8 }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className={cardClass}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className={`font-bold ${isNight ? 'text-red-50' : 'text-white'}`}>Secondary Robot</h4>
                        <span className="text-xs text-ui-warning font-mono">Responder Unit Beta</span>
                    </div>
                    <span className={`flex h-3 w-3 rounded-full ${['dispatching', 'extinguishing'].includes(simulationState) ? 'bg-ui-accent shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse' : 'bg-ui-700'}`}></span>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm bg-ui-900/50 p-2.5 rounded-lg border border-ui-800">
                        <span className="text-ui-muted">Status:</span>
                        <span className={`font-medium ${['dispatching', 'extinguishing'].includes(simulationState) ? 'text-ui-warning' : 'text-white'}`}>
                            {['idle', 'analyzing', 'transmitting', 'evaluating'].includes(simulationState) ? 'Standby Base Station' :
                                simulationState === 'dispatching' ? `Deploying to ${activeSector.name}` :
                                    simulationState === 'extinguishing' ? 'Executing Extinguish Protocol' :
                                        'Returning to Base'}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm bg-ui-900/50 p-2.5 rounded-lg border border-ui-800">
                        <span className="text-ui-muted">Comm Link:</span>
                        <span className={`${['transmitting', 'reporting'].includes(simulationState) ? 'text-ui-warning animate-pulse' : 'text-ui-success'} font-mono flex items-center gap-1`}>
                            <Wifi className="w-4 h-4" /> {['transmitting', 'reporting'].includes(simulationState) ? 'AWAITING_TX' : 'STABLE'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
