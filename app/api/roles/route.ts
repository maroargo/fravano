import { IRole } from "@/interfaces/role";
import { db } from "@/lib/db";
import { roleSchema } from '@/lib/zod';
import { Status } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.role.findMany({
            include: {
                accessRoles: true
            },                      
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = roleSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.role.create({
            data: {
                name: data.name
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding role:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Role ID is required' }, { status: 400 });
        }        

        const deleted = await db.$transaction([
            db.accessRole.deleteMany({
                where: { 
                    idRole: id
                 },
            }),
            db.role.delete({
                where: { id },
            })
        ]);  

        if (!deleted) {
            return NextResponse.json({ message: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting role:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = roleSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as IRole;

        if (!id) {
            return NextResponse.json({ message: 'Role ID is required' }, { status: 400 });
        }

        const updated = await db.role.update({
            where: { id },
            data: {
                name: data.name,
                status: rest.idStatus == "0" ? Status.active : Status.inactive
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}