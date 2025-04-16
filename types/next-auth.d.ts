import { IOrganizationSession } from "@/interfaces/organization";
import { IRoleSession } from "@/interfaces/role";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      idOrganization?: string,            
      idAddressType?: string        
      organization?: IOrganizationSession
      role?: IRoleSession  
    } & DefaultSession["user"];
  }

  interface User { 
    idOrganization?: string,            
    idAddressType?: string   
    organization?: IOrganizationSession
    role?: IRoleSession  
  }
}

declare module "next-auth/jwt" {
  interface JWT { 
    idOrganization?: string,            
    idAddressType?: string   
    organization?: IOrganizationSession
    role?: IRoleSession       
  }
}