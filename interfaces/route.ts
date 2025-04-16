import { IDriver } from "./driver";
import { Patient, RoutePreference, RoutePriority, RouteType, StatusTrip, Timezone, Type } from "@prisma/client";

export interface IRoute {
    id: string
    name: string
    dateRoute: Date 
    idRouteAsign: string
    routeType: RouteType
    idRouteType: string 
    idRoutePriority: string 
    routePriority: RoutePriority    
    idDriver: string
    driver: IDriver
    idPatient: string
    patient: Patient
    idTimezone: string
    timezone: Timezone
    type: Type
    idType: string
    idRoutePreference: string 
    routePreference: RoutePreference
    status: string
    idRouteDetail: string
    routeDetails: IRouteDetail[]
}

export interface IRouteDetail {
    id: string
    item: string     
    address: string
    estimation: Date
    lat: number
    lng: number
    notes: string
    statusTrip: StatusTrip
}
