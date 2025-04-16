import { db } from "@/lib/db";
import { vehicleSchema } from '@/lib/zod';
import { Status, Vehicle } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.vehicle.findMany({
            include: {
                vehicleType: {
                    select: {
                        name: true,
                    },
                },
                driver: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            where: {
                status: Status.active,
                driver: {
                    user: {
                        ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),
                    },
                },                
            },            
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}