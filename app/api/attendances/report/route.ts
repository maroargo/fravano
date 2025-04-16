import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        const dateRouteIniParam = request.nextUrl.searchParams.get('dateRouteIni');  
        const dateRouteEndParam = request.nextUrl.searchParams.get('dateRouteEnd');                       

        const dateRouteIni = new Date(new Date(dateRouteIniParam ? dateRouteIniParam : "").setHours(0, 0, 0, 0));
        const dateRouteFin = new Date(new Date(dateRouteEndParam ? dateRouteEndParam : "").setHours(23, 59, 59, 999));

        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.attendance.findMany({  
            include: {
                employee: true,  
                location: true,              
            },
            where : {
                employee: {
                    location: {
                        ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),
                    },
                },
                date: {
                    gte: dateRouteIni,
                    lte: dateRouteFin,
                }
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
