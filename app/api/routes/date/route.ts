import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        const dateRouteParam = request.nextUrl.searchParams.get('dateRoute');                

        const dateRouteIni = new Date(new Date(dateRouteParam ? dateRouteParam : "").setHours(0, 0, 0, 0));
        const dateRouteFin = new Date(new Date(dateRouteParam ? dateRouteParam : "").setHours(23, 59, 59, 999));

        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.route.findMany({  
            include: {
                driver: {
                    select: {
                        user: true
                    },
                },
                type: true,
                routeType: true,
                routePriority: true,
                timezone: true,
                routeDetails: true,  
                routePreference: true,             
            },
            where: {
                driver: {
                    user: {
                        ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),
                    },
                },  
                dateRoute: {
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
        console.error('Error fetching route:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}