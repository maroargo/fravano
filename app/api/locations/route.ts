import { db } from "@/lib/db";
import { locationSchema } from '@/lib/zod';
import { Location, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.location.findMany({
            include: {               
                organization: true,
            },  
            where: {                
                ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),                
            },                     
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = locationSchema.safeParse(body);

        const session = await auth();

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;
        
        const newData = await db.location.create({
            data: {
                name: data.name,                
                address: data.address,
                idOrganization: session?.user.idOrganization ? session?.user.idOrganization : data.idOrganization                               
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Organización es requerido' }, { status: 400 });
        }

        const deleted = await db.location.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Organización no válida' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Organización eliminada satisfactoriamente' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = locationSchema.safeParse(rest);
        
        const session = await auth();

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Location;

        if (!id) {
            return NextResponse.json({ message: 'Location ID is required' }, { status: 400 });
        }

        const updated = await db.location.update({
            where: { id },
            data: {
                name: data.name,                
                address: data.address,                
                idOrganization: session?.user.idOrganization ? session?.user.idOrganization : data.idOrganization, 
                status: rest.idStatus == "0" ? Status.active : Status.inactive,              
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Location not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}