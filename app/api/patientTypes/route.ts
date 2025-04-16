import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.patientType.findMany({                    
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching patient type:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}