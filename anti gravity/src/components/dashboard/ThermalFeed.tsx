import { Camera, Radio, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ThermalFeed({ sim }: { sim: any }) {
    const { intensity, activeSector, simulationState } = sim;
    const [noiseOffset, setNoiseOffset] = useState(0);

    const isActive = simulationState !== 'idle' && simulationState !== 'resolved';

    // Randomize noise pattern to create a realistic static scanline effect
    useEffect(() => {
        let req: number;
        const animateNoise = () => {
            setNoiseOffset(Math.random() * 100);
            req = requestAnimationFrame(animateNoise);
        };
        if (isActive) req = requestAnimationFrame(animateNoise);
        return () => cancelAnimationFrame(req);
    }, [isActive]);

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel rounded-xl p-6 border border-ui-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] mt-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest">
                    <Camera className="w-5 h-5 text-ui-text" /> UAV Thermal Feed
                </h4>
                <div className="flex items-center gap-2">
                    {isActive ? (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="flex items-center gap-1 text-xs font-mono text-ui-critical font-bold mt-1 tracking-widest"
                        >
                            <span className="w-2 h-2 rounded-full bg-ui-critical shadow-[0_0_8px_#ef4444]"></span> LIVE REC
                        </motion.span>
                    ) : (
                        <span className="text-xs font-mono text-ui-muted tracking-widest">STANDBY</span>
                    )}
                </div>
            </div>

            <div className="w-full h-64 border border-ui-800 rounded-lg relative overflow-hidden bg-ui-950 flex items-center justify-center -z-0">

                {/* Scanline Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none z-10 opacity-30"
                    style={{
                        backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8) 50%)',
                        backgroundSize: '100% 4px',
                        backgroundPosition: `0 ${noiseOffset}px`
                    }}
                ></div>

                {/* Heavy TV Static Overlay during non-active periods */}
                <AnimatePresence>
                    {!isActive && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 mix-blend-screen pointer-events-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'3.5\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                        />
                    )}
                </AnimatePresence>

                {!isActive ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <Radio className="w-12 h-12 text-ui-muted mb-4 animate-pulse duration-1000" />
                        <span className="text-ui-muted font-mono text-sm uppercase tracking-widest">Awaiting Target Acquisition...</span>
                    </motion.div>
                ) : (
                    <>
                        {/* Thermal Gradient Map Simulation */}
                        <motion.div
                            className="absolute inset-0 -z-10 bg-ui-950 mix-blend-screen"
                            animate={{
                                background: intensity > 60
                                    ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.9) 0%, rgba(249,115,22,0.6) 30%, #050505 80%)'
                                    : intensity > 20
                                        ? 'radial-gradient(ellipse at center, rgba(245,158,11,0.7) 0%, rgba(6,182,212,0.4) 40%, #050505 90%)'
                                        : 'radial-gradient(ellipse at center, rgba(6,182,212,0.8) 0%, #050505 70%)'
                            }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Thermal Heat Map Ping Wave */}
                        <motion.div
                            className="absolute border border-white/20 rounded-full"
                            animate={{ width: ['0%', '100%'], height: ['0%', '200%'], opacity: [0.8, 0] }}
                            transition={{ duration: intensity > 60 ? 0.8 : 2, repeat: Infinity, ease: 'easeOut' }}
                        />

                        {/* Drone Target Brackets (Corner markers) */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <motion.div
                                className="w-1/2 h-1/2 border border-white/5 rounded relative"
                                animate={{ scale: intensity > 60 ? [1, 1.05, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            >
                                {/* Top Left Bracket */}
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-ui-accent/80"></div>
                                {/* Top Right Bracket */}
                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-ui-accent/80"></div>
                                {/* Bottom Left Bracket */}
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-ui-accent/80"></div>
                                {/* Bottom Right Bracket */}
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-ui-accent/80"></div>

                                {/* Center Crosshair */}
                                <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-ui-accent/40" />
                            </motion.div>
                        </div>

                        {/* Telemetry OSD (On-Screen Display) */}
                        <div className="absolute top-3 left-3 z-20 font-mono text-[11px] text-ui-text/80 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                            <div className="flex gap-2">
                                <span className="text-ui-muted">LAT</span> <span>34°2'11"N</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-ui-muted">LON</span> <span>118°14'3"W</span>
                            </div>
                            <div className="flex gap-2 text-ui-accent mt-1 tracking-widest">
                                <span>TGT_LCK:</span> <span>[{activeSector.name}]</span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 left-3 z-20 font-mono text-[11px] text-ui-text/80 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                            <div>UAV_ALT: 124m</div>
                            <div>UAV_SPD: 0.0kn (HOVER)</div>
                        </div>

                        <div className="absolute top-3 right-3 z-20 text-right">
                            <div className="w-16 h-10 border border-ui-800 bg-ui-950/50 rounded flex flex-col justify-center items-center">
                                <span className="text-[8px] text-ui-muted font-mono uppercase tracking-widest">Gimbal</span>
                                <span className="text-[10px] text-white font-mono">-14°</span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 right-3 z-20 font-mono text-[12px] text-right drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                            <div className="mb-1 text-ui-text">
                                CORE_T: <span className="font-bold">{(24 + (intensity * 4.5)).toFixed(1)}°C</span>
                            </div>
                            <motion.div
                                className={`px-2 py-0.5 rounded border ${intensity > 60 ? 'bg-ui-critical/20 text-ui-critical border-ui-critical font-bold' : 'bg-ui-warning/20 text-ui-warning border-ui-warning'}`}
                                animate={intensity > 60 ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            >
                                SYS_LVL: {intensity}%
                            </motion.div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
