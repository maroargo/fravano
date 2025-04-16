import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.role.findMany({
            include: {
                accessRoles: true
            }, 
            where: {
                status: Status.active,                                    
                ...(!esAdmin ? { name: { not: "Administrator" } } : {}),   
            },          
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}