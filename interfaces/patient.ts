import { Organization, PatientType } from "@prisma/client"

export interface IPatient {
    id: string
    patientId: string
    name: string
    address: string
    notes: string    
    status: string
    idPatientType: string
    patientType?: PatientType
    idOrganization: string        
    organization?: Organization  
}