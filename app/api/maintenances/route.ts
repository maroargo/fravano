import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.maintenance.findMany({
            include: {
                vehicle: {
                    select: {
                        name: true,
                        driver: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },                        
                    },
                },
                maintenanceDetails: true
            },            
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching maintenances:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();        

        console.log(body);
        
        const newData = await db.maintenance.create({
            data: {
                idVehicle: body.idVehicle,
                description: body.description,
                maintenanceDetails: {
                  createMany: {
                    data: body.maintenanceDetails,
                  },
                }                
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding maintenance:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Maintenance ID is required' }, { status: 400 });
        }

        const deleted = await db.$transaction([
            db.maintenanceDetail.deleteMany({
                where: { 
                    idMaintenance: id
                 },
            }),
            db.maintenance.delete({
                where: { id },
            })
        ]);          

        if (!deleted) {
            return NextResponse.json({ message: 'Maintenance not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Maintenance deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting maintenance:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;        

        if (!id) {
            return NextResponse.json({ message: 'Maintenance ID is required' }, { status: 400 });
        }

        const updated = await db.maintenance.update({
            where: { id },
            data: {
                idVehicle: rest.idVehicle,
                description: rest.description
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Maintenance not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating maintenance:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}