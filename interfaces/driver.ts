import { LicenseState, User } from "@prisma/client";

export interface IDriver {
    id: string
    licensePlate: string
    vinNumber: string
    licenseNumber: string
    idLicenseState: string
    licenseState: LicenseState
    dateExpiredLicense: Date
    status: string    
    idUser: string
    user: User
}