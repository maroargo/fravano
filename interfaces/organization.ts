import { OrganizationParams, Timeformat, Timezone } from "@prisma/client"

export interface IOrganization {
    id: string
    name: string
    email: string
    address: string
    logo: string
    lat: string
    lng: string
    status: string 
        
    idTimezone: string
    timezone: Timezone
    idTimeformat: string
    timeformat: Timeformat
    organizationParams: OrganizationParams[]
}

export interface IOrganizationSession {    
    name: string
    logo: string
}