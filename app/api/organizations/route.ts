import { db } from "@/lib/db";
import { organizationSchema } from '@/lib/zod';
import { Organization, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.organization.findMany({ 
            include: {
                timezone: true,
                timeformat: true,
                organizationParams: true,
            }, 
            where: {                
                ...(!esAdmin ? { id: session?.user.idOrganization } : {}),                
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
        const result = organizationSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.organization.create({
            data: {
                name: data.name,
                email: data.email,
                address: data.address,
                logo: data.logo,
                idTimezone: data.idTimezone,
                idTimeformat: data.idTimeformat
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
            return NextResponse.json({ message: 'ID Organización is required.' }, { status: 400 });
        }

        const deletedParams = await db.organizationParams.deleteMany({
            where: { idOrganization: id },
        });

        if (deletedParams) {
            const deleted = await db.organization.delete({
                where: { id },
            });

            if (!deleted) {
                return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
            }
        } else {
            return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
        }       

        return NextResponse.json({ message: 'Organization deleted.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = organizationSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Organization;

        if (!id) {
            return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
        }

        const updated = await db.organization.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                address: data.address,
                status: rest.idStatus == "0" ? Status.active : Status.inactive,
                logo: data.logo,
                idTimezone: data.idTimezone,
                idTimeformat: data.idTimeformat
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}