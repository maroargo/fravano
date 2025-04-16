import { db } from "@/lib/db";
import { pharmacySchema } from '@/lib/zod';
import { StatusPharmacy } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try { 
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.pharmacy.findMany({  
            include: {               
                patient: true,
                pharmacyDetails: true
            },             
            where: {
                status: StatusPharmacy.pending,
                patient: {
                    ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),
                },                
            },         
            orderBy: {
                createdAt: 'asc',
            },
        });                         
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching pharmacys:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();                

        const newData = await db.pharmacy.create({
            data: {
              dateOrder: body.dateOrder,
              order: body.order,
              address: body.address,                
              idPatient: body.idPatient,              
              pharmacyDetails: {
                createMany: {
                  data: body.pharmacyDetails,
                },
              }              
            },
          });        

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding pharmacy:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Pharmacy ID is required' }, { status: 400 });
        }

        const deleted = await db.$transaction([
            db.pharmacyDetail.deleteMany({
                where: { 
                    idPharmacy: id
                 },
            }),
            db.pharmacy.delete({
                where: { id },
            })
        ]);        

        if (!deleted) {
            return NextResponse.json({ message: 'Pharmacy not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Pharmacy deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting pharmacy:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = pharmacySchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        if (!id) {
            return NextResponse.json({ message: 'Pharmacy ID is required' }, { status: 400 });
        }                 

        const updated = await db.pharmacy.update({
            where: { id },
            data: {
                order: data.order,
                address: data.address,                
                idPatient: data.idPatient                             
            },
        });        

        if (!updated) {
            return NextResponse.json({ message: 'Pharmacy not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating pharmacy:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}