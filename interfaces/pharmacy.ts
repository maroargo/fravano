import { Patient, PharmacyDetail } from "@prisma/client";

export interface IPharmacy {
    id: string
    address: string
    order: string
    lat: string
    lng: string
    status: string
    dateOrder: Date 
    dateDelivery: Date 
    copay: string
    idPatient: string
    patient: Patient
    idPharmacyDetail: string
    pharmacyDetails: PharmacyDetail[]
}