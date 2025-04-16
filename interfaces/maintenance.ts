import { IVehicle } from "./vehicle";

export interface IMaintenance {
    id: string
    description: string
    idMaintenanceDetail: string
    maintenanceDetails: IMaintenanceDetail[]
    status: string
    idVehicle: string  
    vehicle?: IVehicle
}

export interface IMaintenanceDetail {
    date: Date
    status: string    
}