import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            idOrganization?: string,                             
            organization?: IOrganizationSession
            role?: IRoleSession 
        } & DefaultSession["user"];
    }

    interface User {
        idOrganization?: string,                
        organization?: IOrganizationSession
        role?: IRoleSession
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        idOrganization?: string,                    
        organization?: IOrganizationSession
        role?: IRoleSession
    }
}