import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const vehicles = await db.vehicleType.findMany({                    
            orderBy: {
                createdAt: 'asc',
            },
        });        
        
        return NextResponse.json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicle type:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}