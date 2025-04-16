import { Location } from "@prisma/client"
import { IEmployee } from "./employee"

export interface IAttendance {
  id: string
  date: Date
  ipAddress: string
  macAddress: string
  lat: number
  lng: number
  notes: string

  status: string
    
  idEmployee: string
  employee?: IEmployee
  idLocation: string
  location?: Location

  type: string
  typeRegister: string
}

export interface IAttendanceDetail {
  id: string
  date: Date
  idEmployee: string
  idLocation: string
  identifier: string
  type_in: string
  notes_in: string
  time_in: Date
  type_out: string
  notes_out: string
  time_out: Date
  hours_diff: string
  firstName: string
  lastName: string
}

export interface IAttendanceTotal {    
  idEmployee: string  
  total_hours: string  
}

export interface IExcelAttendance {
  identifier: string
  employee: string
  type: string  
  date: string
  hub: string
  work_location: string    
  notes: string
  address: string          
}