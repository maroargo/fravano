import { db } from "@/lib/db";
import { userSchema, userUpdateSchema } from '@/lib/zod';
import { Status, User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrator";

        const data = await db.user.findMany({  
            include: {
                organization: {
                    select: {
                        name: true,
                        logo: true,
                    },
                },
                role: {
                    select: {
                        name: true,
                    },
                },
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
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = userSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        //exists email
        const userExist = await db.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (userExist) {            
            return NextResponse.json({ message: 'Email user already exists' }, { status: 500 });
        }

        //hash pass
        const passwordHash = await bcrypt.hash(data.password, 10);         

        const newData = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash,
                phone: data.phone,
                idOrganization: data.idOrganization,
                idRole: data.idRole
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding user:', error);
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
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = userUpdateSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as User;

        if (!id) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }        

        const updated = await db.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,    
                phone: data.phone,            
                idOrganization: data.idOrganization,
                idRole: data.idRole,
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