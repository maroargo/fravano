import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const idLocation = request.nextUrl.searchParams.get('idLocation') ?? "";

        const dataLocation = await db.location.findFirst({
            where: { 
                id: idLocation
            }
        });

        const data = await db.organization.findFirst({
            where: { 
                id: dataLocation?.idOrganization
            }
        });
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}