import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();                      

        const data = await db.organizationParams.findFirst({ 
            where: {                
                idOrganization: session?.user.idOrganization
            }
        });
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        const body = await request.json();
        const { id, ...rest } = body;
        
        if (!session?.user.idOrganization) {
            return NextResponse.json({ message: 'ID Organización is required.' }, { status: 400 });
        }        

        if (id) {
            //Update
            const updated = await db.organizationParams.update({
                where: { id },
                data: {
                    identifier: rest.identifier,
                    clockIn: rest.clockIn,
                    clockOut: rest.clockOut,
                    idPayPeriodType: rest.idPayPeriodType,
                    payPeriodStart: rest.payPeriodStart,                    
                    analyticTitle: rest.analyticTitle,
                    analyticSrc: rest.analyticSrc,
                },
            });
    
            if (!updated) {
                return NextResponse.json({ message: 'Organization Param not found' }, { status: 404 });
            }
    
            return NextResponse.json(updated, { status: 200 });
        } else {
            //Create
            const newData = await db.organizationParams.create({
                data: {  
                    identifier: rest.identifier,
                    clockIn: rest.clockIn,
                    clockOut: rest.clockOut,
                    idPayPeriodType: rest.idPayPeriodType,
                    payPeriodStart: rest.payPeriodStart,                    
                    analyticTitle: rest.analyticTitle,
                    analyticSrc: rest.analyticSrc,
                    idOrganization: session?.user.idOrganization ?? ""               
                },
            });

            return NextResponse.json(newData, { status: 201 });
        }        
                
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}