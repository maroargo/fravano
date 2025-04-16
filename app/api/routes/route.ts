import { db } from "@/lib/db";
import { RouteDetailSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
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
                routeDetails: true, 
                routePreference: true,               
            },  
            where: {
                driver: {
                    user: {
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
        console.error('Error fetching route:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {        
        //Timezone        
        const session = await auth();
        const org = await db.organization.findUnique({                       
            where: {
                id: session?.user.idOrganization
            }
        }); 

        const body = await request.json();                

        body.routeDetails.forEach((detail: RouteDetailSchema) => {
            if (detail.estimation !== null) detail.estimation = new Date(detail.estimation)                                    
        });                  
        
        //Patient        
        const patient = await db.patient.findUnique({                       
            where: {
                id: body.idPatient
            }
        }); 

        const nameRoute = patient?.name.toUpperCase() + " (ID: " + patient?.patientId + ")";  
        const dateRoute = body.routeDetails[0].estimation;         

        const newData = await db.route.create({
            data: {
                name: nameRoute,
                dateRoute: dateRoute,    

                idRouteAsign: body.idRouteAsign,
                idRouteType: body.idRouteType,
                idRoutePriority: body.idRoutePriority,
                idDriver: body.idDriver,
                idType: body.idType,
                idRoutePreference: body.idRoutePreference,
                idPatient: body.idPatient,
                idTimezone: org?.idTimezone,
                routeDetails: {
                  createMany: {
                    data: body.routeDetails.map((detail: { lat: any; lng: any; estimation: string | number | Date; }) => {
                        return {
                            ...detail, 
                            lat: detail.lat ? detail.lat : 0,
                            lng: detail.lng ? detail.lng : 0,                         
                            estimation: detail.estimation ? new Date(detail.estimation) : ""                            
                        }
                    }),
                  },
                }  
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding route:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Route ID is required' }, { status: 400 });
        }

        const deleted = await db.$transaction([
            db.routeDetail.deleteMany({
                where: { 
                    idRoute: id
                 },
            }),
            db.route.delete({
                where: { id },
            })
        ]);         

        if (!deleted) {
            return NextResponse.json({ message: 'Route not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Route deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting route:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}