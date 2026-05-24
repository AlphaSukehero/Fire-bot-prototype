import { NextResponse } from 'next/server';
import { updateHardwareState } from '@/lib/hardwareState';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { bot_id, intensity, state, status } = body;

        // We only care about Scout Alpha for this prototype
        if (bot_id !== 'Alpha') {
            return NextResponse.json({ error: 'Unknown bot ID' }, { status: 400 });
        }

        // Determine simulation phase based on intensity
        let nextSimulationState = 'idle';
        let dispatchNeeded = false;
        let targetCoords = null;

        if (intensity >= 60) {
            dispatchNeeded = true;
            targetCoords = "Sector A-1"; // Mock coordinates since the physical bot doesn't send GPS
            nextSimulationState = 'extinguishing';
        } else if (intensity >= 20) {
            nextSimulationState = 'analyzing';
        }

        const updated = updateHardwareState({
            intensity: typeof intensity === 'number' ? intensity : parseFloat(intensity || '0'),
            bot1State: state || 'SAFE',
            bot1Status: status || 'Moving randomly (Patrol)',
            lastBot1Update: Date.now(),
            dispatch: dispatchNeeded,
            targetCoords,
            // Only modify simulation state if we are tracking something, else stay idle
            simulationState: nextSimulationState as any,
        });

        return NextResponse.json({ success: true, timestamp: updated.lastBot1Update });
    } catch (error) {
        console.error('Failed to parse Bot 1 report:', error);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}
