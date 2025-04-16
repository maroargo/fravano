import { AddressType, Organization } from "@prisma/client";

export interface IAddress {
    id: string
    name: string
    address: string
    lat: number
    lng: number
    status: string
    idAddressType: string
    idOrganization: string
    idRole: string  
    addressType?: AddressType
    organization?: Organization  
}