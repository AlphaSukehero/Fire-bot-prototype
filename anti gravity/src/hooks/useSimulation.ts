"use client";

import { useState, useEffect, useRef } from 'react';
import { SECTORS } from '@/lib/constants';

export function useSimulation() {
    const [mode, setMode] = useState<'auto' | 'manual' | 'hardware'>('auto');
    const [simulationState, setSimulationState] = useState('idle');
    const [intensity, setIntensity] = useState(0);
    const [scenario, setScenario] = useState<{ type: string; peak: number }>({ type: 'none', peak: 0 });
    const [activeSector, setActiveSector] = useState(SECTORS[0]);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [patrolPos, setPatrolPos] = useState({ left: '15%', top: '15%' });

    // New Drone and Environment States
    const [battery, setBattery] = useState(100);
    const [payload, setPayload] = useState(100);
    const [wind, setWind] = useState({ speed: 12, direction: 'NW' });
    const [temperature, setTemperature] = useState(38);
    const [theme, setTheme] = useState<'standard' | 'night_ops'>('standard');
    const [targetWaypoint, setTargetWaypoint] = useState<{ left: string; top: string } | null>(null);

    const [history, setHistory] = useState<number[]>(Array(20).fill(0));

    const audioCtxRef = useRef<AudioContext | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sirenRef = useRef<any>(null);

    // Audio Siren Logic
    useEffect(() => {
        if (intensity >= 60 && audioEnabled) {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioCtxRef.current?.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            if (!sirenRef.current && audioCtxRef.current) {
                const osc = audioCtxRef.current.createOscillator();
                const gain = audioCtxRef.current.createGain();

                osc.type = 'square';
                osc.frequency.setValueAtTime(600, audioCtxRef.current.currentTime);

                const lfo = audioCtxRef.current.createOscillator();
                lfo.type = 'sine';
                lfo.frequency.value = 2.5;
                const lfoGain = audioCtxRef.current.createGain();
                lfoGain.gain.value = 300;

                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);

                gain.gain.value = 0.05;

                osc.connect(gain);
                gain.connect(audioCtxRef.current.destination);

                osc.start();
                lfo.start();
                sirenRef.current = { osc, lfo, gain };
            }
        } else {
            if (sirenRef.current) {
                sirenRef.current.osc.stop();
                sirenRef.current.lfo.stop();
                sirenRef.current.osc.disconnect();
                sirenRef.current = null;
            }
        }
    }, [intensity, audioEnabled]);

    // Cleanup Audio on Unmount
    useEffect(() => {
        return () => {
            if (sirenRef.current) {
                sirenRef.current.osc.stop();
                sirenRef.current.lfo.stop();
            }
        };
    }, []);

    // Hardware Polling Logic
    useEffect(() => {
        if (mode !== 'hardware') return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/hardware/state');
                if (res.ok) {
                    const data = await res.json();

                    if (Date.now() - data.lastBot1Update < 10000) {
                        setIntensity(data.intensity);
                        setSimulationState(data.simulationState);
                    } else {
                        // Loss of signal or no recent reports from physical bot
                        setIntensity(0);
                        setSimulationState('idle');
                    }
                }
            } catch (err) {
                console.error('Hardware polling failed:', err);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [mode]);

    // 24/7 Patrol Logic
    useEffect(() => {
        if (simulationState === 'idle') {
            const patrolWaypoints = [
                { left: '20%', top: '20%' },
                { left: '50%', top: '20%' },
                { left: '80%', top: '50%' },
                { left: '50%', top: '80%' },
                { left: '20%', top: '50%' },
            ];
            let wpIdx = 0;
            setPatrolPos(patrolWaypoints[wpIdx]);

            const pTimer = setInterval(() => {
                wpIdx = (wpIdx + 1) % patrolWaypoints.length;
                setPatrolPos(patrolWaypoints[wpIdx]);
            }, 4000);

            return () => clearInterval(pTimer);
        }
    }, [simulationState]);

    // Auto Simulation Logic
    useEffect(() => {
        if (mode === 'manual' || mode === 'hardware') return;

        let interval: ReturnType<typeof setInterval>;
        let timeout: ReturnType<typeof setTimeout>;

        if (simulationState === 'analyzing') {
            interval = setInterval(() => {
                setIntensity((prev) => {
                    const step = scenario.type === 'critical' ? 8 : scenario.type === 'minor' ? 3 : 5;
                    if (prev + step >= scenario.peak) {
                        setSimulationState('transmitting');
                        return scenario.peak;
                    }
                    return prev + step;
                });
            }, 1200);
        } else if (simulationState === 'transmitting') {
            timeout = setTimeout(() => setSimulationState('evaluating'), 4000);
        } else if (simulationState === 'evaluating') {
            timeout = setTimeout(() => {
                if (scenario.peak >= 60) setSimulationState('dispatching');
                else setSimulationState('resolving_minor');
            }, 4000);
        } else if (simulationState === 'dispatching') {
            timeout = setTimeout(() => setSimulationState('extinguishing'), 6000);
        } else if (simulationState === 'extinguishing' || simulationState === 'resolving_minor') {
            interval = setInterval(() => {
                setIntensity((prev) => {
                    const next = prev - (simulationState === 'resolving_minor' ? 2 : 6);
                    if (next <= 0) {
                        setSimulationState('verifying');
                        return 0;
                    }
                    return next;
                });
            }, 1000);
        } else if (simulationState === 'verifying') {
            timeout = setTimeout(() => setSimulationState('reporting'), 4000);
        } else if (simulationState === 'reporting') {
            timeout = setTimeout(() => setSimulationState('resolved'), 4000);
        }

        return () => {
            if (interval) clearInterval(interval);
            if (timeout) clearTimeout(timeout);
        };
    }, [simulationState, mode, scenario]);

    // Vitals & Environment Logic
    useEffect(() => {
        const vitalsTimer = setInterval(() => {
            if (simulationState === 'extinguishing') {
                setPayload(p => Math.max(0, p - 6));
                setBattery(b => Math.max(0, b - 1.5));
            } else if (['dispatching', 'reporting', 'resolving_minor', 'analyzing'].includes(simulationState)) {
                setBattery(b => Math.max(0, b - 0.5));
            } else {
                setBattery(b => Math.max(0, b - 0.1));
                if (simulationState === 'idle' && payload < 100) {
                    setPayload(p => Math.min(100, p + 5)); // refilling payload at base
                }
            }

            // Randomize wind slightly
            setWind(w => {
                const directions = ['N', 'NE', 'NW', 'W', 'SW', 'S', 'SE', 'E'];
                const spin = Math.random() > 0.95 ? directions[Math.floor(Math.random() * directions.length)] : w.direction;
                return {
                    speed: Math.max(2, Math.min(35, w.speed + (Math.random() > 0.5 ? 2 : -2))),
                    direction: spin,
                }
            });
            // Fluctuate temp based on intensity
            setTemperature(t => Math.max(25, Math.min(120, t + (intensity > 50 ? 2 : (intensity > 20 ? 0.5 : -0.5)))));
        }, 1000);
        return () => clearInterval(vitalsTimer);
    }, [simulationState, payload, intensity]);

    // DB Logger
    useEffect(() => {
        const t = setInterval(() => {
            setHistory((prev) => [...prev.slice(1), intensity]);

            const logData = {
                timestamp: new Date().toISOString(),
                localTime: new Date().toLocaleTimeString(),
                mode: mode.toUpperCase(),
                scenario: mode === 'auto' ? (scenario.type === 'none' ? 'IDLE' : scenario.type.toUpperCase()) : 'MANUAL OVERRIDE',
                intensity,
                state: simulationState.toUpperCase(),
                primaryBotStatus: ['transmitting', 'reporting'].includes(simulationState) ? 'Transmitting Data (ESP32)' : 'Monitoring/Analyzing',
                secondaryBotStatus: ['dispatching', 'extinguishing'].includes(simulationState) ? 'Active Response' : 'Standby Base Station',
                commLink: ['transmitting', 'reporting'].includes(simulationState) ? 'Transmitting Data...' : 'Connected (Idle)',
                targetCoords: ['dispatching', 'extinguishing'].includes(simulationState) ? 'Locked to ESP32 Signal' : 'N/A',
            };

            fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData),
            }).catch((e) => console.error('Error tracking log to DB', e));
        }, 1000);

        return () => clearInterval(t);
    }, [intensity, simulationState, mode, scenario]);

    const clearData = async () => {
        if (confirm('Are you sure you want to clear all persistent logs and history? (Note: DB wipe not implemented in API yet, resetting Local State)')) {
            setHistory(Array(20).fill(0));
        }
    };

    const handleManualIntensityChange = (val: number) => {
        if (intensity === 0 && val > 0) {
            let newSector;
            do {
                newSector = SECTORS[Math.floor(Math.random() * SECTORS.length)];
            } while (newSector.id === activeSector.id);
            setActiveSector(newSector);
        }
        setIntensity(val);
        if (val >= 60) {
            setSimulationState('extinguishing');
        } else if (val >= 20) {
            setSimulationState('analyzing');
        } else {
            setSimulationState('idle');
        }
    };

    const startSimulation = () => {
        const types = [
            { type: 'critical', peak: Math.floor(Math.random() * 10) + 90 },
            { type: 'major', peak: Math.floor(Math.random() * 15) + 75 },
            { type: 'minor', peak: Math.floor(Math.random() * 15) + 35 },
        ];
        const selectedScenario = types[Math.floor(Math.random() * types.length)];

        let newSector;
        do {
            newSector = SECTORS[Math.floor(Math.random() * SECTORS.length)];
        } while (newSector.id === activeSector.id);

        setActiveSector(newSector);
        setScenario(selectedScenario);
        setIntensity(10);
        setSimulationState('analyzing');
    };

    const resetSimulation = () => {
        setIntensity(0);
        setSimulationState('idle');
        setScenario({ type: 'none', peak: 0 });
    };

    return {
        mode,
        setMode,
        simulationState,
        setSimulationState,
        intensity,
        setIntensity,
        scenario,
        setScenario,
        activeSector,
        setActiveSector,
        audioEnabled,
        setAudioEnabled,
        patrolPos,
        history,
        resetSimulation,
        startSimulation,
        clearData,
        handleManualIntensityChange,
        battery,
        setBattery,
        payload,
        setPayload,
        wind,
        setWind,
        temperature,
        setTemperature,
        theme,
        setTheme,
        targetWaypoint,
        setTargetWaypoint,
    };
}
