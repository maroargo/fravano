"use server";

import { z } from "zod";
import { companySchema, joinSchema, registerSchema, signInSchema } from "@/lib/zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Status } from "@prisma/client";

import { auth } from "@/auth";

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

        const loc = await db.location.findFirst({
            where: {                
                status: Status.active,
                id: data.idLocation
            }
        });

        const org = await db.organization.findFirst({
            where: {                
                status: Status.active,
                id: loc?.idOrganization
            }
        }); 

        const emp = await db.employee.findFirst({
            where: {
                location: {
                    idOrganization: org?.id     
                },
                status: Status.active,
                identifier: data.identifier                
            }
        });        
        const idEmpleado = emp?.id;
        
        if (!emp) {
            return { error: "Invalid User ID." }
        }         
        
        await db.attendance.create({
            data: {
                ipAddress: data.ipAddress ? data.ipAddress : "127.0.0.1",
                idLocation: data.idLocation,
                date: new Date,
                notes: "",
                idEmployee: idEmpleado,
                type: data.type,
                typeRegister: "System"
            },
        });        

        return { success: true, employee: emp.firstName + " " + emp.lastName };

    } catch (error) {        
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: "Error 500" };
    }
};

export const registerJoinAction = async(
    values: z.infer<typeof joinSchema>
) => {
    try {
        const {data, success} = joinSchema.safeParse(values);                  

        if (!success) {
            return { error: "Invalid data." }
        }

        //Compare pass
        if (data.password != data.repeatPassword) {
            return { error: "Passwords don`t match." }
        }

        //Validated Email
        const existMail = await db.organization.findFirst({ 
            where: {                
                email: data.email             
            }
        }); 

        if (existMail) {
            return { error: "Email already exists." }
        }
        
        //Register Organization
        const organization = await db.organization.create({
            data: {
                name: data.organization,
                email: data.email,
                address: data.address                             
            },
        });

        //Role
        const role = await db.role.findFirst({ 
            where: {                
                name: "Standar Admin"              
            }
        });                 

        //Register User
        const passwordHash = await bcrypt.hash(data.password, 10); 
        const newData = await db.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash,
                phone: data.phone,
                idOrganization: organization?.id,
                idRole: role?.id              
            },
        }); 

        if (newData) {
            await signIn("credentials", {
                email: values.email,
                password: values.password,            
                redirect: false
            });
        }                

        return { success: true, newData };

    } catch (error) {              
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: "Error 500" };
    }
};

export const registerCompanyAction = async(
    values: z.infer<typeof companySchema>
) => {
    try {
        const session = await auth(); 

        const {data, success} = companySchema.safeParse(values);                  

        if (!success) {
            return { error: "Invalid data" }
        }

        const id = session?.user.idOrganization;
        if (!id) {
            return { error: "Organization ID is required" }            
        }

        //Update Company
        const updated = await db.organization.update({
            where: { id },
            data: {                
                logo: data.logo,
                idTimezone: data.idTimezone,
                idTimeformat: data.idTimeformat
            },
        });

        if (updated) {
            const newData = await db.organizationParams.create({
                data: {  
                    identifier: data.identifier,                                      
                    idOrganization: session?.user.idOrganization ?? ""               
                },
            });

            return { success: true, newData };
        }

        return { success: true, updated };

    } catch (error) {              
        if (error instanceof AuthError) {
            return { error: error.cause?.err?.message };
        }
        return { error: "Error 500" };
    }
};