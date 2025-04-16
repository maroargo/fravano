import { Organization, Role } from "@prisma/client";
import { IOrganizationSession } from "./organization";
import { IRoleSession } from "./role";

export interface IUser {
  id?: string
  name?: string
  email?: string
  phone?: string
  password?: string
  emailVerified?: Date
  image?: string
  status?: string
  idOrganization?: string
  idRole?: string  
  organization?: Organization
  role?: Role
}

export interface IUserSession {  
  name?: string  
  email?: string
  idOrganization?: string    
  organization?: IOrganizationSession
  role?: IRoleSession
}
