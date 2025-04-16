import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.justification.findMany({  
            include: {
                employee: true, 
                typeJustification: true,               
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
        
        const newData = await db.justification.create({
            data: {
                idEmployee: body.idEmployee,
                dateIni: body.dateIni ? body.dateIni : new Date,
                dateEnd: body.dateEnd ? body.dateEnd : new Date,                
                notes: body.notes,
                idTypeJustification: body.idTypeJustification
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
            return NextResponse.json({ message: 'Justification ID is required' }, { status: 400 });
        }

        const deleted = await db.justification.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Justification not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Justification deleted successfully' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        
        if (!id) {
            return NextResponse.json({ message: 'Justification ID is required' }, { status: 400 });
        }        

        const updated = await db.justification.update({
            where: { id },
            data: {
                idEmployee: rest.idEmployee,
                dateIni: rest.dateIni ? rest.dateIni : new Date,
                dateEnd: rest.dateEnd ? rest.dateEnd : new Date,                
                notes: rest.notes,
                idTypeJustification: rest.idTypeJustification                
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Justification not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}