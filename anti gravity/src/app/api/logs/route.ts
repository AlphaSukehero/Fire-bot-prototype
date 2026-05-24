import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const stmt = db.prepare('SELECT * FROM sys_logs ORDER BY id DESC LIMIT 100');
        const logs = stmt.all();
        return NextResponse.json(logs);
    } catch (error) {
        console.error('Failed to fetch logs from DB:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            timestamp, localTime, mode, scenario, intensity,
            state, primaryBotStatus, secondaryBotStatus, commLink, targetCoords
        } = body;

        const stmt = db.prepare(`
      INSERT INTO sys_logs (
        timestamp, localTime, mode, scenario, intensity, 
        state, primaryBotStatus, secondaryBotStatus, commLink, targetCoords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const info = stmt.run(
            timestamp, localTime, mode, scenario, intensity,
            state, primaryBotStatus, secondaryBotStatus, commLink, targetCoords
        );

        return NextResponse.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
        console.error('Failed to insert log to DB:', error);
        return NextResponse.json({ error: 'Failed to insert log' }, { status: 500 });
    }
}
