import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const idLocation = request.nextUrl.searchParams.get('idLocation') ?? "";

        const data = await db.location.findFirst({
            where: { 
                id: idLocation
            }
        });
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}