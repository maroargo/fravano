import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return new Response("Token not found", { status: 400 });
    }

    const verifyToken = await db.verificationToken.findFirst({
        where: {
            token
        }
    });

    if (!verifyToken) {
        return new Response("Token not found", { status: 400 });
    }

    //Expired
    if (verifyToken.expires < new Date) {
        return new Response("Token expired", { status: 400 });
    }

    //Exists
    const user = await db.user.findUnique({
        where: {
            email: verifyToken.identifier
        }
    });

    if (user?.emailVerified) {
        return new Response("Email already verified", { status: 400 });
    }

    //Check Success
    await db.user.update({
        where: {
            email: verifyToken.identifier
        },
        data: {
            emailVerified: new Date
        }
    });

    //Delete token verified
    await db.verificationToken.delete({
        where: {
           identifier : verifyToken.identifier
        }
    });

    redirect("/login?verified=true");
};