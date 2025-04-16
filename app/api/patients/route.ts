import { db } from "@/lib/db";
import { patientSchema } from "@/lib/zod";
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.patient.findMany({
            include: {
                patientType: true,
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
        console.error('Error fetching patient:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = patientSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.patient.create({
            data: {
                patientId: data.patientId,
                name: data.name,
                address: data.address,
                idPatientType: data.idPatientType,
                notes: data.notes,
                idOrganization: data.idOrganization
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding patient:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
        }

        const deleted = await db.patient.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Patient deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting patient:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;        

        if (!id) {
            return NextResponse.json({ message: 'Patient ID is required' }, { status: 400 });
        }

        const updated = await db.patient.update({
            where: { id },
            data: {
                patientId: rest.patientId,
                name: rest.name,
                address: rest.address,
                idOrganization: rest.idOrganization,
                idPatientType: rest.idPatientType,
                notes: rest.notes,
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