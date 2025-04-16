import { IRole } from "@/interfaces/role";
import { db } from "@/lib/db";
import { roleSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = roleSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        if (!id) {
            return NextResponse.json({ message: 'Access Role ID is required' }, { status: 400 });
        } 
        
        console.log(id);

        const updated = await db.accessRole.findMany({
            where: { idRole: id }
        })  

        console.log(updated);
        
        /*data.accessRoles.map((m) =>
            db.accessRole.createMany({
                data: {
                    idRole: m.idRole,
                    idMenu: m.idMenu,
                    access: m.access,
                    add: m.add                        
                }
            })   
        ) */

        if (!updated) {
            return NextResponse.json({ message: 'Access Role not found' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}