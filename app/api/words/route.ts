import { NextResponse } from 'next/server';
import { sampleWords } from '@/lib/words';
 
export const dynamic = 'force-dynamic';
 
export function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const parsed = Number.parseInt(searchParams.get('count') ?? '', 10);
    const count = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 300) : 60;
    const setId = searchParams.get('set') || 'builtin';

    return NextResponse.json({ words: sampleWords(count) });
}
 