import { db } from "@/lib/db";
import { vehicleSchema } from '@/lib/zod';
import { Vehicle } from '@prisma/client';
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = vehicleSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.vehicle.create({
            data: {
                name: data.name,
                label: data.label,
                make: data.make,
                model: data.model,
                year: data.year,
                licensePlate: data.licensePlate,
                idVehicleType: data.idVehicleType,
                idDriver: data.idDriver
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Vehicle ID is required' }, { status: 400 });
        }

        const deleted = await db.vehicle.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Vehicle deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = vehicleSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Vehicle;

        if (!id) {
            return NextResponse.json({ message: 'Vehicle ID is required' }, { status: 400 });
        }

        const updated = await db.vehicle.update({
            where: { id },
            data: {
                name: data.name,
                label: data.label,
                make: data.make,
                model: data.model,
                year: data.year,
                licensePlate: data.licensePlate,
                idVehicleType: data.idVehicleType,
                idDriver: data.idDriver
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}