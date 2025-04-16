import { VehicleType } from "@prisma/client";
import { IDriver } from "./driver";

export interface IVehicle {
    id: string
    name: string
    label: string
    make: string
    model: string
    year: string
    licensePlate: string
    status: string
    idVehicleType: string  
    vehicleType?: VehicleType
    idDriver: string
    driver: IDriver
}