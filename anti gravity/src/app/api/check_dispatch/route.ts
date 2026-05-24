import { NextResponse } from 'next/server';
import { getHardwareState, updateHardwareState } from '@/lib/hardwareState';

// Since this is a simple prototype, Bot 2 checks via GET
export async function GET() {
    const currentState = getHardwareState();

    // If a dispatch is active, Bot 2 reads it
    if (currentState.dispatch) {
        // Optional: We can automatically reset dispatch so it doesn't get flooded,
        // or we let it stay active until fire intensity goes below threshold (handled by Bot 1 updates).
        // For this flow, we'll keep it simple and just serve the current bool.

        return NextResponse.json({
            dispatch: true,
            target_coords: currentState.targetCoords
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            }
        });
    }

    return NextResponse.json({
        dispatch: false,
        target_coords: null
    }, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
    });
}
