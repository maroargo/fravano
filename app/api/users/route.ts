import { db } from "@/lib/db";
import { userSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

import bcrypt from "bcryptjs";
import { Status } from "@prisma/client";

export async function GET() {
    try {
        const session = await auth();              
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.user.findMany({ 
            include: {
                role: true,
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
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = userSchema.safeParse(body);

        const session = await auth();

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        //hash pass
        const passwordHash = await bcrypt.hash(data.password, 10); 

        const newData = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash,
                phone: data.phone || "",
                idOrganization: session?.user.idOrganization ? session?.user.idOrganization : data.idOrganization, 
                idRole: data.idRole                
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
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const deleted = await db.user.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;        

        const session = await auth();

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }                 

        const updated = await db.user.update({
            where: { id },
            data: {
                name: rest.name,
                email: rest.email,    
                phone: rest.phone,            
                idOrganization: session?.user.idOrganization ? session?.user.idOrganization : rest.idOrganization, 
                idRole: rest.idRole,
                status: rest.idStatus == "0" ? Status.active : Status.inactive
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}