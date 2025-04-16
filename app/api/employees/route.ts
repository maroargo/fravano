import { db } from "@/lib/db";
import { employeeSchema } from '@/lib/zod';
import { Employee, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrator";        

        const data = await db.employee.findMany({  
            include: {                
                location: {
                    select: {
                        name: true,
                        organization: true,
                    },
                },
                mode: true,
            },  
            where: { 
                location: {
                    ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),     
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

        //Identifier exist
        const session = await auth();  
        const employee = await db.employee.findFirst({
            where: {
                location: {
                    idOrganization: session?.user.idOrganization
                },
                identifier: body.identifier
            }
        });

        if (employee) {
            return NextResponse.json({ message: 'User ID already exists.' }, { status: 400 });
        }        

        const newData = await db.employee.create({
            data: {
                firstName: body.firstName,  
                lastName: body.lastName,               
                identifier: body.identifier,
                email: body.email,                
                phone: body.phone,
                clockIn: body.clockIn,                
                clockOut: body.clockOut,
                idMode: body.idMode,
                idLocation: body.idLocation                
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
            return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
        }

        const deleted = await db.employee.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Employee ID not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = employeeSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Employee;

        if (!id) {
            return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
        }        

        const updated = await db.employee.update({
            where: { id },
            data: {
                firstName: data.firstName,                
                lastName: data.lastName,                
                identifier: data.identifier,
                email: data.email,                
                phone: data.phone,
                idMode: data.idMode,
                clockIn: body.clockIn,                
                clockOut: body.clockOut,
                idLocation: data.idLocation,
                status: rest.idStatus == "0" ? Status.active : Status.inactive,                
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Employee ID not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}