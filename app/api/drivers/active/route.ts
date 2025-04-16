import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status } from "@prisma/client";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.driver.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    },
                },
                licenseState: {
                    select: {
                        name: true,
                    },
                },
            }, 
            where: {
                status: Status.active,
                user: {
                    ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),
                },                
            },           
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}