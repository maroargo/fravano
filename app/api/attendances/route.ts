import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.attendance.findMany({  
            include: {
                employee: {                    
                    include: {
                        location: true,
                    }
                }, 
                location: true,               
            }, 
            where : {
                employee: {
                    location: {
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
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();                

        const newData = await db.attendance.create({
            data: {
                ipAddress: body.ipAddress,
                macAddress: body.macAddress,
                date: body.date ? body.date : new Date,
                notes: body.notes,
                idEmployee: body.idEmployee,
                idLocation: body.idLocation,
                type: body.type,
                typeRegister: "Manual"
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
            return NextResponse.json({ message: 'Attendance ID is required' }, { status: 400 });
        }

        const deleted = await db.attendance.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Attendance not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Attendance deleted successfully' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;                

        if (!id) {
            return NextResponse.json({ message: 'Attendance ID is required' }, { status: 400 });
        }        

        const updated = await db.attendance.update({
            where: { id },
            data: {
                ipAddress: rest.ipAddress,
                macAddress: rest.macAddress,
                date: rest.date ? rest.date : new Date,
                notes: rest.notes,
                idEmployee: rest.idEmployee,
                idLocation: body.idLocation,
                type: body.type,
                typeRegister: "Manual"
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Attendance not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}