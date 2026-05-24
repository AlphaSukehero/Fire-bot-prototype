import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const stmt = db.prepare('SELECT * FROM sys_logs ORDER BY id DESC');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const logs = stmt.all() as any[];

        if (!logs.length) {
            return new NextResponse('No logs available', { status: 404 });
        }

        const headers = Object.keys(logs[0]).join(',');
        const rows = logs.map(log =>
            Object.values(log).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
        );

        const csvData = [headers, ...rows].join('\n');

        return new NextResponse(csvData, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="mission_logs.csv"',
            },
        });
    } catch (error) {
        console.error('Failed to export logs:', error);
        return NextResponse.json({ error: 'Failed to export logs' }, { status: 500 });
    }
}
