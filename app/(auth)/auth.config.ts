import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { IUserSession } from "@/interfaces/user";
import { Status } from "@prisma/client";

export default {
  trustHost: true, // Explicitly trust the host
  providers: [    
    Credentials({          
      authorize: async (credentials) => {                         

        const {data, success} = signInSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid Credentials");
        }

        //Verify User
        const user = await db.user.findUnique({
           
          include: {            
            organization: true,
            role: true
          }, 
          where: {
            email: data.email,
            status: Status.active
          }
        });        

        if (!user || !user.password) {
          throw new Error("Invalid Credentials");
        }

        //Verify Pass
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Invalid Credentials");
        }                  

        const userSession: IUserSession = {          
          name: user.name || "",          
          email: user.email,
          idOrganization: user.organization?.id,
          organization: {            
            name: user.organization?.name || "",
            logo: user.organization?.logo || ""
          },
          role: {
            id: user.role?.id || "",              
            name: user.role?.name || "",
          }
        } 

        return userSession;
        
      }
    })
  ],
} satisfies NextAuthConfig