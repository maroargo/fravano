import { db } from "@/lib/db";
import { Status } from '@prisma/client';
import { NextResponse } from 'next/server';
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
                status: Status.active,
                location: {
                    ...(!esAdmin ? { idOrganization: session?.user.idOrganization } : {}),     
                },                                                                     
            },      
            orderBy: {
                createdAt: 'asc',
            },
        });     
                
        const updatedData = data.map(emp => ({
            ...emp,
            fullName: `${emp.firstName} ${emp.lastName}`,
            completeName: `(${emp.identifier}) ${emp.firstName} ${emp.lastName}`,
        }));
        
        return NextResponse.json(updatedData);
    } catch (error) {       
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}