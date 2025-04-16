import { Language, Locale, Timezone } from "@prisma/client";

export interface IOrganization {
    id: string
    name: string
    email: string
    address: string
    logo: string
    lat: string
    lng: string
    status: string
    idLocale: string
    locale: Locale
    idTimezone: string
    timezone: Timezone
    idLanguage: string
    language: Language
}

export interface IOrganizationSession {    
    name: string
    logo: string
}