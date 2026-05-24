import { Bot, Flame, Map as MapIcon, Crosshair } from 'lucide-react';
import { SECTORS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TacticalMap({ sim }: { sim: any }) {
    const { simulationState, activeSector, intensity, patrolPos, targetWaypoint, setTargetWaypoint, setMode, theme } = sim;

    const getPrimaryBotPosition = () => {
        if (targetWaypoint) return targetWaypoint;
        if (['idle', 'resolved'].includes(simulationState)) return patrolPos;
        if (simulationState === 'verifying') return { left: activeSector.verLeft, top: activeSector.verTop };
        return { left: activeSector.left, top: activeSector.top };
    };

    const getSecondaryBotPosition = () => {
        if (['idle', 'analyzing', 'transmitting', 'evaluating', 'resolved'].includes(simulationState)) return { left: '10%', top: '10%' };
        return { left: activeSector.secLeft, top: activeSector.secTop };
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setTargetWaypoint({ left: `${x.toFixed(1)}%`, top: `${y.toFixed(1)}%` });
        setMode('manual');
    };

    const showPrimaryPath = simulationState !== 'idle' && simulationState !== 'resolved' && !targetWaypoint;
    const showSecondaryPath = ['dispatching', 'extinguishing', 'verifying', 'reporting'].includes(simulationState);
    const isNight = theme === 'night_ops';

    // Particle effect array for the water spray
    const waterParticles = Array.from({ length: 8 });

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`lg:col-span-3 glass-panel rounded-xl p-6 border shadow-[0_0_40px_rgba(0,0,0,0.5)] ${isNight ? 'border-red-900/50 bg-[#120404]' : 'border-ui-800'}`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className={`${isNight ? 'text-red-50' : 'text-white'} font-bold flex items-center gap-2 tracking-wide`}>
                    <MapIcon className={`w-5 h-5 ${isNight ? 'text-red-500' : 'text-indigo-400'}`} /> TACTICAL FLOOR PLAN
                </h4>
                <div className="flex gap-4 text-xs font-mono text-ui-muted">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ui-accent shadow-[0_0_8px_#06b6d4] animate-pulse"></span> Alpha Path</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-ui-warning shadow-[0_0_8px_#f59e0b] animate-pulse"></span> Beta Path</span>
                </div>
            </div>

            <div
                onClick={handleMapClick}
                className={`w-full h-48 sm:h-96 tactical-grid border rounded-lg relative overflow-hidden cursor-crosshair transition-colors duration-500 ${isNight ? 'border-red-900/40 bg-[#050000]' : 'border-ui-800 bg-ui-950/50'}`}
            >
                {/* Advanced SVG Overlay for laser lines and paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <AnimatePresence>
                        {targetWaypoint && (
                            <motion.path
                                key="manual-path"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                d={`M 15 15 L ${parseFloat(targetWaypoint.left)} ${parseFloat(targetWaypoint.top)}`}
                                fill="none" stroke="rgba(6,182,212,0.8)" strokeWidth="0.5" strokeDasharray="1 1"
                                className="animate-[dash_1s_linear_infinite]"
                            />
                        )}
                        {showPrimaryPath && !targetWaypoint && (
                            <motion.path
                                key="primary-path"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                                d={`M 15 15 L ${parseInt(activeSector.left)} 15 L ${parseInt(activeSector.left)} ${parseInt(activeSector.top)}`}
                                fill="none" stroke="rgba(6,182,212,0.8)" strokeWidth="0.5" strokeDasharray="1 1"
                                className="drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] animate-[dash_1s_linear_infinite]"
                            />
                        )}
                        {showSecondaryPath && (
                            <motion.path
                                key="secondary-path"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                                d={`M 10 10 L 10 ${parseInt(activeSector.secTop)} L ${parseInt(activeSector.secLeft)} ${parseInt(activeSector.secTop)}`}
                                fill="none" stroke="rgba(245,158,11,0.8)" strokeWidth="0.5" strokeDasharray="1 1"
                                className="drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] animate-[dash_1s_linear_infinite]"
                            />
                        )}
                        {/* Extinguishing Water Spray Effect */}
                        {simulationState === 'extinguishing' && (
                            <motion.g key="water-spray" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {waterParticles.map((_, i) => (
                                    <motion.circle
                                        key={`drop-${i}`}
                                        r="0.4"
                                        fill="rgba(56,189,248,0.8)"
                                        className="drop-shadow-[0_0_5px_rgba(56,189,248,1)]"
                                        initial={{
                                            cx: parseInt(activeSector.secLeft),
                                            cy: parseInt(activeSector.secTop)
                                        }}
                                        animate={{
                                            cx: [parseInt(activeSector.secLeft), parseInt(activeSector.fireLeft) + (Math.random() * 4 - 2)],
                                            cy: [parseInt(activeSector.secTop), parseInt(activeSector.fireTop) + (Math.random() * 4 - 2)],
                                            scale: [0.5, 1.5, 0],
                                        }}
                                        transition={{
                                            duration: 0.5 + Math.random() * 0.3,
                                            repeat: Infinity,
                                            delay: Math.random() * 0.5,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Base Station Icon */}
                <div className={`absolute top-4 left-4 border border-dashed w-24 h-24 rounded flex items-start justify-start p-1 ${isNight ? 'border-red-900/50 bg-red-900/10' : 'border-ui-700 bg-ui-800/30'}`}>
                    <span className="text-[10px] text-ui-muted font-bold uppercase z-10 relative pointer-events-none tracking-widest">Base</span>
                </div>

                {/* Sector Grid Markers */}
                {SECTORS.map((sector) => (
                    <motion.div
                        key={sector.id}
                        layout
                        className={`absolute border border-dashed rounded flex p-1 transition-colors duration-500 pointer-events-none
                  ${sector.id === activeSector.id && simulationState !== 'idle' ? (isNight ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-ui-critical/80 bg-ui-critical/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]') : (isNight ? 'border-red-900/30' : 'border-ui-800 bg-ui-900/40')}
               `}
                        style={{
                            width: '40px', height: '40px',
                            left: `calc(${sector.left} - 20px)`, top: `calc(${sector.top} - 20px)`
                        }}
                    >
                        <span className={`text-[10px] font-bold uppercase z-10 relative ${(sector.id === activeSector.id && simulationState !== 'idle') ? (isNight ? 'text-red-400' : 'text-ui-critical drop-shadow-[0_0_8px_#ef4444]') : 'text-ui-700'}`}>
                            {sector.id}
                        </span>
                        {(sector.id === activeSector.id && simulationState !== 'idle') && (
                            <motion.div
                                className="absolute inset-0 border border-ui-critical rounded"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                ))}

                {/* Primary Bot (Scout Alpha) Area */}
                <motion.div
                    className="absolute -ml-16 -mt-16 w-32 h-32 flex flex-col items-center justify-center z-20 pointer-events-none"
                    animate={getPrimaryBotPosition()}
                    transition={{ type: "spring", stiffness: 45, damping: 22, mass: 1 }}
                >
                    {/* Glowing Radar Sweep */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.1)_270deg,rgba(6,182,212,0.8)_360deg)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-4 rounded-full border border-ui-accent/20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    <div className="bg-ui-accent p-1.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,1)] relative z-30">
                        <Bot className="w-5 h-5 text-ui-900" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-ui-accent mt-2 drop-shadow-md bg-ui-950/80 px-2 py-0.5 rounded border border-ui-accent/30 tracking-widest">
                        SC0UT_ALPHA
                    </span>
                </motion.div>

                {/* Fire Marker Element */}
                <AnimatePresence>
                    {intensity > 0 && (
                        <motion.div
                            key="fire-marker"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute w-12 h-12 -ml-6 -mt-14 flex flex-col items-center justify-center pointer-events-none z-10"
                            style={{ left: activeSector.fireLeft, top: activeSector.fireTop }}
                        >
                            {/* Radiating fire rings */}
                            {intensity > 60 && (
                                <>
                                    <motion.div className="absolute inset-0 rounded-full border-2 border-ui-critical" animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                                    <motion.div className="absolute inset-0 rounded-full border-2 border-ui-critical" animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} />
                                </>
                            )}
                            <motion.div
                                animate={{ scale: 1 + intensity / 60, y: [0, -2, 0] }}
                                transition={{ y: { duration: 0.5, repeat: Infinity } }}
                                className={`p-2 rounded-full z-10 ${intensity > 60 ? 'bg-ui-critical shadow-[0_0_40px_rgba(239,68,68,1)]' : 'bg-ui-warning shadow-[0_0_20px_rgba(245,158,11,0.8)]'} `}
                            >
                                <Flame className="w-5 h-5 text-white" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Secondary Bot (Responder Beta) Area */}
                <motion.div
                    className="absolute -ml-16 -mt-16 w-32 h-32 flex flex-col items-center justify-center z-30 pointer-events-none"
                    animate={getSecondaryBotPosition()}
                    transition={{ type: "spring", stiffness: 55, damping: 28, mass: 1 }}
                >
                    {/* Active response ping */}
                    {simulationState === 'extinguishing' && (
                        <motion.div
                            className="absolute inset-8 rounded-full border-2 border-ui-warning"
                            animate={{ scale: [1, 2], opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}

                    <div className="bg-ui-warning p-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,1)] relative z-20">
                        {simulationState === 'extinguishing' && <div className="absolute inset-0 rounded-full bg-ui-warning animate-ping opacity-50 pointer-events-none"></div>}
                        <Bot className="w-5 h-5 text-ui-900" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-ui-warning mt-2 drop-shadow-md bg-ui-950/80 px-2 py-0.5 rounded border border-ui-warning/30 tracking-widest">
                        RSPNDR_BETA
                    </span>
                </motion.div>

            </div>
            {/* Added global animation styles for the SVG dashed lines */}
            <style jsx global>{`
                @keyframes dash {
                    to { stroke-dashoffset: -2; }
                }
            `}</style>
        </motion.div>
    );
}
