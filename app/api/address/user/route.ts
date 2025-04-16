import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const userName = request.nextUrl.searchParams.get('userName');
        console.log(userName)

        if (!userName) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const data = await db.address.findMany({
            where: {
                name: userName
            },
            include: {
                addressType: {
                    select: {
                        name: true,
                    },
                },
                organization: {
                    select: {
                        name: true,
                    },
                }
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}
