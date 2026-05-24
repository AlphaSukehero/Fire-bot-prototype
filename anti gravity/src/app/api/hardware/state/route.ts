import { NextResponse } from 'next/server';
import { getHardwareState } from '@/lib/hardwareState';

export async function GET() {
    const state = getHardwareState();
    return NextResponse.json(state, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
    });
}
