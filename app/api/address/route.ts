import { db } from "@/lib/db";
import { addressSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.address.findMany({  
            include: {
                addressType: {
                    select: {
                        name: true,
                    },
                },
                organization: {
                    select: {
                        name: true,
                    },
                }
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
        console.error('Error fetching address:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = addressSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.address.create({
            data: {
                name: data.name,
                address: data.address,
                idOrganization: data.idOrganization,
                idAddressType: data.idAddressType,
                lat: data.lat,
                lng: data.lng
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding address:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        console.log(request.nextUrl.searchParams)
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Address ID is required' }, { status: 400 });
        }

        const deleted = await db.address.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting address:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = addressSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        if (!id) {
            return NextResponse.json({ message: 'Address ID is required' }, { status: 400 });
        }

        const updated = await db.address.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,                
                idOrganization: data.idOrganization,
                idAddressType: data.idAddressType
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating address:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}