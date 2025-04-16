import { db } from "@/lib/db";
import { StatusPharmacy } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try { 
        const dateOrderParam = request.nextUrl.searchParams.get('dateOrder');                

        const dateOrderIni = new Date(new Date(dateOrderParam ? dateOrderParam : "").setHours(0, 0, 0, 0));
        const dateOrderFin = new Date(new Date(dateOrderParam ? dateOrderParam : "").setHours(23, 59, 59, 999));

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
                dateOrder: {
                    gte: dateOrderIni,
                    lte: dateOrderFin,
                }                
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