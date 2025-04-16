import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.patient.findMany({   
            include: {
                patientType: true,
                organization: true,
            },
            where: {
                status: Status.active,
                ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),
            },                 
            orderBy: {
                createdAt: 'asc',
            },
        });        
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching patient:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}