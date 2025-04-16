import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();                

        const newData = await db.driver.create({
            data: {
                licensePlate: body.licensePlate,
                vinNumber: body.vinNumber,
                licenseNumber: body.licenseNumber,
                idLicenseState: body.idLicenseState,
                dateExpiredLicense: body.dateExpiredLicense ? body.dateExpiredLicense : new Date(),
                idUser: body.idUser
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding driver:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Driver ID is required' }, { status: 400 });
        }

        const deleted = await db.driver.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Driver deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting driver:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        
        if (!id) {
            return NextResponse.json({ message: 'Driver ID is required' }, { status: 400 });
        }

        const updated = await db.driver.update({
            where: { id },
            data: {
                licensePlate: rest.licensePlate,
                vinNumber: rest.vinNumber,
                licenseNumber: rest.licenseNumber,
                idLicenseState: rest.idLicenseState,
                dateExpiredLicense: rest.dateExpiredLicense,
                idUser: rest.idUser
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}