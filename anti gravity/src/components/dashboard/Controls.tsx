import { Trash2, Volume2, VolumeX, Flame, Download, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Controls({ sim }: { sim: any }) {
    const { mode, setMode, audioEnabled, setAudioEnabled, startSimulation, resetSimulation, clearData, intensity, handleManualIntensityChange, simulationState, theme, setTheme, setTargetWaypoint } = sim;

    const isNight = theme === 'night_ops';

    const handleCsvExport = async () => {
        try {
            const res = await fetch('/api/export');
            if (!res.ok) throw new Error('Failed to export');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `FireBotSync_Mission_Logs_${new Date().getTime()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to export logs", err);
            alert("Failed to export logs. Ensure the server is running and data exists.");
        }
    };

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`glass-panel rounded-xl p-4 border shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6 transition-colors duration-1000 ${isNight ? 'border-red-900/50 bg-[#120404]' : 'border-ui-800'}`}>
            <div className="flex flex-col xl:flex-row justify-between items-center gap-4">

                <div className={`flex rounded-lg p-1 border shadow-inner ${isNight ? 'bg-black border-red-900/40' : 'bg-ui-900 border-ui-800'}`}>
                    <button
                        onClick={() => { setMode('auto'); setTargetWaypoint(null); resetSimulation(); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'auto' ? (isNight ? 'bg-red-900/30 text-red-100' : 'bg-ui-700 text-white shadow') : 'text-ui-muted hover:text-white'}`}
                    >
                        Auto Simulation
                    </button>
                    <button
                        onClick={() => { setMode('manual'); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'manual' ? 'bg-ui-critical/20 text-ui-critical shadow border border-ui-critical/50' : 'text-ui-muted hover:text-white'}`}
                    >
                        Manual Override
                    </button>
                    <button
                        onClick={() => { setMode('hardware'); resetSimulation(); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'hardware' ? 'bg-cyan-500/20 text-cyan-400 shadow border border-cyan-500/50' : 'text-ui-muted hover:text-white'}`}
                    >
                        Hardware Sync
                    </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap justify-center">
                    <button
                        onClick={() => setTheme(isNight ? 'standard' : 'night_ops')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${isNight ? 'bg-red-900/20 text-red-400 border-red-500/50' : 'bg-ui-800 text-ui-muted hover:text-white border-ui-700'}`}
                    >
                        {isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        {isNight ? 'NIGHT OPS' : 'STANDARD'}
                    </button>

                    <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${audioEnabled ? 'bg-ui-critical/20 text-ui-critical border-ui-critical/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-ui-800 text-ui-muted border-ui-700'}`}
                    >
                        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        SOUND {audioEnabled ? 'ON' : 'OFF'}
                    </button>

                    {mode === 'auto' && (
                        <button
                            onClick={simulationState === 'idle' || simulationState === 'resolved' ? startSimulation : resetSimulation}
                            className="px-4 py-2 text-sm font-bold rounded-lg bg-ui-accent text-ui-900 hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
                        >
                            {simulationState === 'idle' || simulationState === 'resolved' ? 'Trigger Random Event' : 'Reset Timeline'}
                        </button>
                    )}

                    <button
                        onClick={handleCsvExport}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-ui-800 text-ui-success hover:bg-ui-success/20 transition-colors border border-ui-success/30 cursor-pointer"
                    >
                        <Download className="w-4 h-4" /> Export DB
                    </button>

                    <button
                        onClick={clearData}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-ui-800 text-ui-muted hover:bg-ui-critical hover:text-white transition-colors border border-ui-700 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" /> Clear Local
                    </button>
                </div>

            </div>

            {mode === 'manual' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-ui-800 flex items-center gap-4 overflow-hidden">
                    <Flame className={`w-5 h-5 ${intensity > 60 ? 'text-ui-critical animate-pulse' : intensity > 20 ? 'text-ui-warning' : 'text-ui-700'}`} />
                    <input
                        type="range" min="0" max="100"
                        value={intensity}
                        onChange={(e) => handleManualIntensityChange(Number(e.target.value))}
                        className={`flex-1 cursor-pointer ${isNight ? 'accent-red-500' : 'accent-ui-critical'}`}
                    />
                    <span className="text-white font-mono font-bold w-12 text-right">{intensity}%</span>
                </motion.div>
            )}
        </motion.div>
    );
}
