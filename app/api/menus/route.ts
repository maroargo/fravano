import { db } from "@/lib/db";
import { menuSchema } from '@/lib/zod';
import { Menu } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await db.menu.findMany({            
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching menus:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = menuSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.menu.create({
            data: {
                name: data.name,
                url: data.url,
                icon: data.icon,
                idMenu: data.idMenu
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {
        console.error('Error adding menu:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Menu ID is required' }, { status: 400 });
        }

        const deleted = await db.menu.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Menu deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting menu:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = menuSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Menu;

        if (!id) {
            return NextResponse.json({ message: 'Menu ID is required' }, { status: 400 });
        }

        const updated = await db.menu.update({
            where: { id },
            data: {
                name: data.name,
                url: data.url,
                icon: data.icon,
                idMenu: data.idMenu
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating menu:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}