import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.role.findMany({
            include: {
                accessRoles: true
            }, 
            where: {
                status: Status.active,
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