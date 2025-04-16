"use server";

import { z } from "zod";
import { registerSchema, signInSchema } from "@/lib/zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const loginAction = async(
    values: z.infer<typeof signInSchema>
) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,            
            redirect: false
        });

        return { success: true };

    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: "Error 500" };
    }
};

export const registerAction = async(
    values: z.infer<typeof registerSchema>
) => {
    try {                
        const {data, success} = registerSchema.safeParse(values);
        if (!success) {
            return { error: "Invalid data" }
        }

        const user = await db.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (user) {
            return { error: "User already exists" }
        }

        //hash pass
        const passwordHash = await bcrypt.hash(data.password, 10);            

        await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash                
            }
        });

        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
        });

        return { success: true };

    } catch (error) {        
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: "Error 500" };
    }
};