import { Organization } from "@prisma/client"

export interface ILocation {
    id: string
    name: string    
    address: string    
    status: string  
    idOrganization?: string  
    organization?: Organization  
}