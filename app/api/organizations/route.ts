import { db } from "@/lib/db";
import { Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.organization.findMany({ 
            include: {
                locale: {
                    select: {
                        name: true
                    },
                },
                timezone: {
                    select: {
                        name: true
                    },
                },
                language: {
                    select: {
                        name: true
                    },
                }
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
        console.error('Error fetching organizations:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();        

        //exists email
        const orgExist = await db.organization.findUnique({
            where: {
                email: body.email
            }
        });        

        if (orgExist) {            
            return NextResponse.json({ message: 'Email organization already exists' }, { status: 500 });
        }

        const newData = await db.organization.create({
            data: {
                name: body.name,
                email: body.email,
                address: body.address,
                logo: body.logo,
                idLocale: body.idLocale,
                idTimezone: body.idTimezone,
                idLanguage: body.idLanguage                
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding organization:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');        

        if (!id) {
            return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
        }
        
        const deleted = await db.organization.delete({
            where: { id }
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Organization deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting organization:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;        

        if (!id) {
            return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
        }

        const updated = await db.organization.update({
            where: { id },
            data: {
                name: rest.name,
                email: rest.email,
                address: rest.address,
                logo: rest.logo,
                idLocale: rest.idLocale,
                idTimezone: rest.idTimezone,
                idLanguage: rest.idLanguage,
                status: rest.idStatus == "0" ? Status.active : Status.inactive
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating organization:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}